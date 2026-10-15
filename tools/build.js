#!/usr/bin/env node
'use strict';

/**
 * OOOInterface 打包脚本（零依赖，只用 Node 内置模块）
 *
 * 为什么需要它：
 *   Chrome 读取 chrome-extension:// 资源时几乎不并行（实测 50 个文件：并发 58ms /
 *   串行 107ms，每文件约 1.2~2ms），而 ES 模块又是"边下载边发现"的：main.js 里那
 *   24 个 mixin 要等 main.js 下载+解析完才发出请求，再往下还有两层。结果就是主页启
 *   动要串行拉 70 个文件、其中 55 个是 JS，中间还夹着一段段没有请求发出的空窗期。
 *
 *   本脚本把整张静态 import 图按依赖顺序拼成一个文件，把"文件数"降下来。源码仍然
 *   按 mixin 拆分保留（可读性、可维护性不变），打包产物只是构建结果。
 *
 * 用法：
 *   node tools/build.js            # 构建（默认）
 *   node tools/build.js --watch    # 监听源码，改动后自动重建
 *   node tools/build.js --check    # 只校验产物是否为最新（不写文件），适合提交前/CI
 *   node tools/build.js --verbose  # 打印打包进去的模块清单
 *
 * 约定（重要）：
 *   1. 只打包 HTML 里 <script src> 指向的入口（产物以经典 defer 脚本引入，
 *      不用 type="module"：扩展页里模块脚本会被请求两次）；
 *   2. 只处理静态 import；动态 import()（如 Themes/*.js 主题文件）保持原样，
 *      仍然按需单独加载 —— 那是有意为之的运行时加载，不属于启动关键路径；
 *   3. 不支持 `export ... from`（re-export）；一旦出现会直接报错，不会静默产出错文件；
 *   4. 打包是"按依赖顺序拼接 + 去掉 import/export 关键字"，因此同一个 bundle 里
 *      顶层不能出现重名声明——脚本会检测并报错（这正是 mixin 拆分容易踩的坑）。
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ─────────────────────────── 配置 ───────────────────────────
// 每个目标 = 一个入口 + 一个产物 + 对应页面里的 <script src>。
const TARGETS = [
  {
    name: 'main',
    entry: 'main/Script/core/main.js',
    out: 'main/Script/bundle.main.js',
    html: { file: 'main/index.html', src: 'Script/bundle.main.js', was: 'Script/core/main.js' },
  },
  {
    name: 'sidepanel',
    entry: 'main/sidepanel/sidepanel.js',
    out: 'main/sidepanel/bundle.sidepanel.js',
    html: { file: 'main/sidepanel/sidepanel.html', src: 'bundle.sidepanel.js', was: 'sidepanel.js' },
  },
];

// ─────────────────────────── 工具 ───────────────────────────
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const log = (...a) => console.log(...a);

/** 统计某个目录下所有文件的 mtime，用于 --watch 轮询。 */
function snapshotMtimes(dirs, ignore = new Set()) {
  const out = new Map();
  const walk = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const ent of entries) {
      const abs = path.join(dir, ent.name);
      if (ignore.has(abs)) continue;
      if (ent.isDirectory()) walk(abs);
      else if (ent.isFile()) out.set(abs, fs.statSync(abs).mtimeMs);
    }
  };
  dirs.forEach(walk);
  return out;
}

/**
 * 把单个模块切成"正文 + 依赖列表"。
 *
 * 处理三类语法：
 *   import ... from '...'   → 丢弃整条语句，记录依赖
 *   import '...'            → 丢弃整条语句，记录依赖
 *   export { a, b };        → 丢弃整条语句（只影响对外导出，拼接后不需要）
 *   export <声明>           → 去掉开头的 `export `，正文保留
 *
 * 语句边界用"以分号结尾"判定：本项目的 import/export 语句都写分号，一旦遇到
 * 不带分号的会直接抛错，而不是猜一个边界把代码切坏。
 */
function splitModule(src, absPath) {
  const lines = src.split('\n');
  const body = [];
  const deps = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1) import：整条丢掉（要求 import 后跟空白/{/*/引号，避免误伤动态 import( 与 import.meta）
    if (/^import[\s{*'"]/.test(line)) {
      let stmt = line;
      while (!/;\s*$/.test(stmt)) {
        i += 1;
        if (i >= lines.length) {
          throw new Error(`${rel(absPath)} import 语句没有以分号结尾，无法安全切分`);
        }
        stmt += '\n' + lines[i];
      }

      // 裸导入 import 'x';
      const bare = stmt.match(/^\s*import\s*['"]([^'"]+)['"]/);
      if (bare) {
        deps.push({ spec: bare[1] });
        body.push(`// [bundled] import '${bare[1]}'`);
        continue;
      }

      const m = stmt.match(/^\s*import\s+([\s\S]*?)\s*from\s*['"]([^'"]+)['"]/);
      if (!m) throw new Error(`${rel(absPath)}: 无法解析 import 语句：${stmt.replace(/\s+/g, ' ').slice(0, 80)}`);
      const clause = m[1];
      const spec = m[2];
      deps.push({ spec });

      // 默认导入 / 命名空间导入：需要重写绑定，本脚本不支持——报错而不是产出坏文件
      if (!clause.includes('{')) {
        throw new Error(
          `${rel(absPath)}: 不支持默认导入或命名空间导入（"${clause.trim()}"），请改用命名导入`
        );
      }
      const defaultPart = clause.slice(0, clause.indexOf('{')).replace(/,/g, '').trim();
      if (defaultPart) {
        throw new Error(`${rel(absPath)}: 不支持默认导入（"${defaultPart}"），请改用命名导入`);
      }

      // 命名导入：`a` 直接用同名顶层声明；`a as b` 需要补一条改名绑定
      const named = clause.slice(clause.indexOf('{') + 1, clause.lastIndexOf('}'));
      let shims = 0;
      for (const part of named.split(',')) {
        const s = part.trim();
        if (!s) continue;
        const asMatch = s.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
        if (asMatch) {
          body.push(`const ${asMatch[2]} = ${asMatch[1]}; // [bundled] import { ${asMatch[1]} as ${asMatch[2]} }`);
          shims += 1;
        }
      }
      body.push(`// [bundled] import ${shims ? `{ … +${shims} 个改名绑定 }` : '{ … }'} from '${spec}'`);
      continue;
    }

    // 2) export 列表 / re-export：整条丢掉
    if (/^export[\s{*]/.test(line) && !/^export\s+(?:async\s+)?(?:function|class|const|let|var)\b/.test(line)) {
      let stmt = line;
      while (!/;\s*$/.test(stmt)) {
        i += 1;
        if (i >= lines.length) {
          throw new Error(`${rel(absPath)} export 语句没有以分号结尾，无法安全切分`);
        }
        stmt += '\n' + lines[i];
      }
      if (/^\s*export\s+default\b/.test(stmt)) {
        throw new Error(`${rel(absPath)}: 不支持 export default，请改写为命名导出`);
      }
      if (/from\s*['"]/.test(stmt)) {
        throw new Error(`${rel(absPath)}: 不支持 re-export（export ... from '...'），请先改写为 import + export`);
      }
      body.push('// [bundled] export {...}');
      continue;
    }

    // 3) export 声明：去掉 export 前缀，正文保留
    body.push(line.replace(/^export\s+(?=(?:async\s+)?(?:function|class|const|let|var)\b)/, ''));
  }

  return { body: body.join('\n'), deps };
}

/** 收集模块顶层声明名（列 0 才算，函数/对象内部的同名声不算冲突）。 */
function topLevelNames(src) {
  const names = [];
  const re = /^(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z0-9_$]+)/gm;
  let m;
  while ((m = re.exec(src))) names.push(m[1]);
  return names;
}

/** 从入口出发按依赖顺序收集全部模块。 */
function collect(entryAbs) {
  const order = [];
  const state = new Map(); // absPath -> 'visiting' | 'done'
  const cycles = [];

  const visit = (absPath, chain) => {
    const st = state.get(absPath);
    if (st === 'done') return;
    if (st === 'visiting') {
      cycles.push([...chain, absPath].map(rel));
      return;
    }
    state.set(absPath, 'visiting');

    const src = fs.readFileSync(absPath, 'utf8');
    const { body, deps } = splitModule(src, absPath);
    for (const { spec } of deps) {
      if (!spec.startsWith('.')) {
        throw new Error(`${rel(absPath)}: 不支持非相对路径的 import "${spec}"`);
      }
      const depAbs = path.resolve(path.dirname(absPath), spec);
      if (!fs.existsSync(depAbs)) {
        throw new Error(`${rel(absPath)}: 找不到模块 "${spec}"`);
      }
      visit(depAbs, [...chain, absPath]);
    }

    state.set(absPath, 'done');
    order.push({ absPath, body });
  };

  visit(entryAbs, []);
  return { order, cycles };
}

/** 组装 bundle 文本。 */
function buildBundle(target) {
  const entryAbs = path.resolve(ROOT, target.entry);
  if (!fs.existsSync(entryAbs)) throw new Error(`入口不存在：${target.entry}`);

  const { order, cycles } = collect(entryAbs);
  if (cycles.length) {
    log(`  ⚠️  检测到循环依赖（已按首次访问顺序拼接）：`);
    cycles.forEach((c) => log(`      ${c.join(' → ')}`));
  }

  // 顶层重名检测：同名会让单文件版本直接语法报错，或者更糟——静默覆盖。
  const owner = new Map();
  const collisions = [];
  for (const { absPath, body } of order) {
    for (const name of topLevelNames(body)) {
      if (owner.has(name) && owner.get(name) !== absPath) {
        collisions.push({ name, a: owner.get(name), b: absPath });
      } else {
        owner.set(name, absPath);
      }
    }
  }
  if (collisions.length) {
    log(`  ❌ ${target.name}: 顶层声明重名，无法拼成单文件：`);
    collisions.forEach((c) => log(`      "${c.name}" 同时定义于 ${rel(c.a)} 和 ${rel(c.b)}`));
    throw new Error(`${target.name}: 顶层声明重名（${collisions.length} 处）`);
  }

  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  // 内容指纹：用于 --check 判断产物是否过时，同时保证同样输入产出同样文件（便于 git diff）。
  const fingerprint = crypto    .createHash('sha256')
    .update(order.map((m) => `${rel(m.absPath)}\n${m.body}`).join('\n/* ---- */\n'))
    .digest('hex')
    .slice(0, 16);
  const header = [
    '// ⚠️ 本文件由 tools/build.js 自动生成，请勿直接编辑。',
    `// 源码指纹: ${fingerprint}    模块数: ${order.length}`,
    `// 入口: ${target.entry}`,
    '// 源码仍在 main/Script/core/** 按 mixin 拆分维护；改完源码后重新构建：',
    '//     node tools/build.js          （或 node tools/build.js --watch）',
    '',
  ].join('\n');

  const parts = order.map(({ absPath, body }) => `// ==== ${rel(absPath)} ====\n${body.trimEnd()}\n`);
  const text = header + parts.join('\n');

  return { text, order, entryAbs, stamp, fingerprint };
}

/** 校验 bundle 语法（无顶层 await / 无 import.meta 时可按 CommonJS 解析）。 */
function validateSyntax(absPath) {
  try {
    execFileSync(process.execPath, ['--check', absPath], { stdio: 'pipe' });
  } catch (e) {
    const detail = (e.stderr && e.stderr.toString()) || e.message;
    throw new Error(`${rel(absPath)} 语法校验失败：\n${detail}`);
  }
}

/** 检查页面确实引用了产物，且没有同时引用源码入口（那会导致模块被加载两遍）。 */
function verifyHtml(target) {
  const { file, src, was } = target.html;
  const abs = path.resolve(ROOT, file);
  if (!fs.existsSync(abs)) {
    log(`  ⚠️  找不到页面 ${file}，跳过引用检查`);
    return [];
  }
  const text = fs.readFileSync(abs, 'utf8');
  const warnings = [];
  if (!new RegExp(`src=["']${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(text)) {
    warnings.push(`${file} 里没有引用 ${src}（当前仍是源码入口？页面会是旧的加载方式）`);
  }
  if (was && new RegExp(`src=["']${was.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(text)) {
    warnings.push(`${file} 同时引用了源码入口 ${was}，会导致模块被加载两遍，请删掉其中一个标签`);
  }
  return warnings;
}

function runBuild({ check = false, verbose = false } = {}) {
  let failed = false;
  let outOfDate = false;

  for (const target of TARGETS) {
    const outAbs = path.resolve(ROOT, target.out);
    const { text, order, stamp } = buildBundle(target);

    const prev = fs.existsSync(outAbs) ? fs.readFileSync(outAbs, 'utf8') : null;
    const changed = prev !== text;
    const kb = (Buffer.byteLength(text) / 1024).toFixed(1);

    if (check) {
      if (changed) {
        outOfDate = true;
        log(`  ✗ ${target.name}: 产物不是最新（${target.out}）`);
      } else {
        log(`  ✓ ${target.name}: ${order.length} 个模块 → ${target.out}（${kb} KB）已是最新`);
      }
    } else if (changed) {
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      fs.writeFileSync(outAbs, text, 'utf8');
      validateSyntax(outAbs);
      log(`  ✓ ${target.name}: ${order.length} 个模块 → ${target.out}（${kb} KB）${prev ? '已更新' : '已生成'}  @${stamp}`);
    } else {
      log(`  · ${target.name}: ${order.length} 个模块 → ${target.out}（${kb} KB）无变化`);
    }

    if (verbose) order.forEach(({ absPath }) => log(`      ${rel(absPath)}`));

    for (const w of verifyHtml(target)) log(`  ⚠️  ${w}`);
  }

  if (check && outOfDate) {
    log('\n产物不是最新，请运行：node tools/build.js');
    failed = true;
  }
  return failed;
}

// ─────────────────────────── CLI ───────────────────────────
function main() {
  const argv = process.argv.slice(2);
  const check = argv.includes('--check');
  const verbose = argv.includes('--verbose');
  const watch = argv.includes('--watch');

  log(check ? '检查打包产物…' : '打包中…');
  let failed = runBuild({ check, verbose });

  if (watch && !check) {
    const watchDirs = [...new Set(TARGETS.map((t) => path.dirname(path.resolve(ROOT, t.entry))))];
    // 产物本身写在被监听的目录里，必须排除，否则每次构建都会触发下一轮监听
    const ignore = new Set(TARGETS.map((t) => path.resolve(ROOT, t.out)));
    log(`\n监听中（${watchDirs.map(rel).join(', ')}）… Ctrl+C 退出`);
    let snap = snapshotMtimes(watchDirs, ignore);
    setInterval(() => {
      const next = snapshotMtimes(watchDirs, ignore);
      let dirty = next.size !== snap.size;
      if (!dirty) {
        for (const [f, m] of next) {
          if (snap.get(f) !== m) {
            dirty = true;
            break;
          }
        }
      }
      if (dirty) {
        snap = next;
        log('\n检测到改动，重新打包…');
        try {
          runBuild({ verbose: false });
        } catch (e) {
          log('  ❌ ' + e.message);
        }
      }
    }, 400);
  }

  if (failed) process.exit(1);
}

try {
  main();
} catch (e) {
  log('❌ 打包失败：' + e.message);
  process.exit(1);
}
