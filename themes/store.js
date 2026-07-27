let THEMES = [];

const $ = id => document.getElementById(id);
const grid = $('themeGrid');
const searchInput = $('searchInput');
const searchClear = $('searchClear');
const resultCount = $('resultCount');
const emptyState = $('emptyState');

const overlay = $('detailOverlay');
const panel = $('detailPanel');
const detailClose = $('detailClose');
const detailName = $('detailName');
const detailDesigner = $('detailDesigner');
const detailMeta = $('detailMeta');
const detailDesc = $('detailDesc');
const detailActions = $('detailActions');
const detailThumbs = $('detailThumbs');
const detailMainImg = $('detailMainImg');
const sourceOverlay = $('sourceOverlay');
const sourceCode = $('sourceCode');
const sourceClose = $('sourceClose');
const sourceCopy = $('sourceCopy');

let currentTheme = null;
let currentIdx = 0;

function renderCards(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyState.classList.add('visible');
    resultCount.textContent = '没有找到匹配的主题';
    return;
  }
  emptyState.classList.remove('visible');
  list.forEach((t,i)=>{
    const c = document.createElement('div');
    c.className = 'theme-card';
    c.style.setProperty('--i',i);
    const src = t.screenshots[0]||'';
    c.innerHTML =
      '<img class="theme-card-preview" src="'+src+'" alt="'+t.name+'" loading="lazy" onerror="this.style.display=\'none\'">'+
      '<div class="theme-card-body">'+
        '<div class="theme-card-name">'+t.name+'</div>'+
        '<div class="theme-card-designer">'+t.designer+'</div>'+
        '<span class="theme-card-version">'+t.version+'</span>'+
      '</div>';
    c.addEventListener('click',()=>openDetail(t));
    grid.appendChild(c);
  });
  resultCount.textContent = list.length===1 ? '1 个主题' : list.length+' 个主题';
}

function filter(q) {
  q = q.trim().toLowerCase();
  const cards = grid.querySelectorAll('.theme-card');
  let n = 0;
  cards.forEach((c,i)=>{
    const t = THEMES[i];
    if (!q || t.name.toLowerCase().indexOf(q)!==-1 || t.designer.toLowerCase().indexOf(q)!==-1) {
      c.classList.remove('hidden');
      c.style.setProperty('--i',n++);
      c.style.animation='none'; void c.offsetHeight;
      c.style.animation='cardIn .4s cubic-bezier(.22,1,.36,1) forwards';
      c.style.animationDelay='0s';
    } else c.classList.add('hidden');
  });
  if (!n) { emptyState.classList.add('visible'); resultCount.textContent='没有找到匹配的主题'; }
  else { emptyState.classList.remove('visible'); resultCount.textContent=n===1?'1 个主题':n+' 个主题'; }
  searchClear.classList.toggle('visible',!!q);
}

function openDetail(t) {
  currentTheme = t;
  currentIdx = 0;
  document.body.style.overflow = 'hidden';
  detailName.textContent = t.name;
  detailDesigner.textContent = t.designer;

  detailMeta.innerHTML =
    '<div class="detail-meta-item"><div class="detail-meta-label">名称</div><div class="detail-meta-value">'+t.name+'</div></div>'+
    '<div class="detail-meta-item"><div class="detail-meta-label">设计师</div><div class="detail-meta-value">'+t.designer+'</div></div>'+
    '<div class="detail-meta-item"><div class="detail-meta-label">版本</div><div class="detail-meta-value">'+t.version+'</div></div>'+
    '<div class="detail-meta-item"><div class="detail-meta-label">主题 ID</div><div class="detail-meta-value">'+t.id+'</div></div>';

  detailDesc.innerHTML = t.description
    ? '<div class="detail-desc-title">简介</div><p>'+t.description+'</p>'
    : '';

  detailActions.innerHTML =
    '<a class="detail-btn-dl" href="'+t.download+'" download="'+t.name+'.json">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'+
      '下载主题'+
    '</a>'+
    '<button class="detail-btn-secondary" id="detailSourceBtn">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'+
      '查看源代码'+
    '</button>';

  if (t.screenshots.length) {
    detailMainImg.src = t.screenshots[0];
    detailMainImg.style.display = '';
    detailMainImg.onerror = function(){ this.outerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:15px;font-weight:500">无法加载图片</div>'; };
  } else {
    detailMainImg.style.display = 'none';
  }

  detailThumbs.innerHTML = '';
  if (t.screenshots.length > 1) {
    t.screenshots.forEach((src,i)=>{
      const div = document.createElement('div');
      div.className = 'detail-thumb'+(i===0?' active':'');
      div.innerHTML = '<img src="'+src+'" alt="" loading="lazy" onerror="this.parentElement.style.display=\'none\'">';
      div.addEventListener('click',()=>switchImg(i));
      detailThumbs.appendChild(div);
    });
  }

  requestAnimationFrame(()=>{ overlay.classList.add('open'); panel.classList.add('open'); });

  const srcBtn = $('detailSourceBtn');
  if (srcBtn) {
    srcBtn.onclick = function(){
      fetch(t.download).then(r=>r.text()).then(text=>{
        sourceCode.textContent = text;
        sourceOverlay.classList.add('open');
      }).catch(()=>{
        sourceCode.textContent = '/* 无法加载源代码 */';
        sourceOverlay.classList.add('open');
      });
    };
  }
}

function switchImg(i) {
  const t = currentTheme;
  if (!t) return;
  currentIdx = i;
  detailMainImg.style.opacity = '0';
  setTimeout(()=>{
    detailMainImg.src = t.screenshots[i];
    detailMainImg.style.opacity = '1';
  },120);
  detailThumbs.querySelectorAll('.detail-thumb').forEach((d,j)=>d.classList.toggle('active',j===i));
}

function closeDetail() {
  if (!panel.classList.contains('open')) return;
  panel.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  currentTheme = null;
}

searchInput.addEventListener('input',e=>filter(e.target.value));
searchClear.addEventListener('click',()=>{ searchInput.value=''; searchInput.focus(); filter(''); });
detailClose.addEventListener('click',closeDetail);
overlay.addEventListener('click',closeDetail);
function closeSource(){ sourceOverlay.classList.remove('open'); }
sourceClose.addEventListener('click',closeSource);
sourceCopy.addEventListener('click',()=>{
  const t = sourceCode.textContent;
  navigator.clipboard.writeText(t).then(()=>{
    sourceCopy.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(()=>{
      sourceCopy.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    },1800);
  });
});
sourceOverlay.addEventListener('click',e=>{ if(e.target===sourceOverlay) closeSource(); });
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(sourceOverlay.classList.contains('open')) closeSource();
    else closeDetail();
  }
});

fetch('store.json').then(r=>r.json()).then(async ids=>{
  for (const id of ids) {
    try {
      const r2 = await fetch('repo/'+id+'/meta.json');
      const meta = await r2.json();
      const base = 'repo/'+id+'/';
      const screenshots = (meta.picture||[]).map(f=>base+f);
      THEMES.push({
        id, name: meta.name||id, designer: meta.designer||'',
        version: meta.version||'', description: meta.description||'',
        screenshots,
        download: base+(meta.source||id+'.json'),
        meta: base+'meta.json'
      });
    } catch(e) {}
  }
  renderCards(THEMES);
}).catch(()=>{ renderCards([]); });
