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
let searchMode = 'name';
const searchModeBtn = $('searchMode');

// 双 img 滑动切换
const detailHero = document.querySelector('.detail-hero');
const detailImgB = document.createElement('img');
detailImgB.alt = '';
detailImgB.style.opacity = '0';
detailHero.appendChild(detailImgB);
let activeImg = detailMainImg;
let inactiveImg = detailImgB;
let isAnimating = false;

function resetImg(img, opacity) {
  img.style.transition = 'none';
  img.style.transform = '';
  img.style.opacity = opacity;
  img.classList.remove('loading');
  void img.offsetHeight;
  img.style.transition = '';
}

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
      '<div class="theme-card-image-wrap">'+
        '<img class="theme-card-preview" src="'+src+'" alt="'+t.name+'" loading="lazy" onerror="this.style.display=\'none\'">'+
      '</div>'+
      '<div class="theme-card-body" style=\'--card-img: url("'+src+'")\'>'+
        '<div class="theme-card-name">'+t.name+'</div>'+
        '<div class="theme-card-meta">'+
          '<div class="theme-card-designer">'+t.designer+'</div>'+
          '<span class="theme-card-version">'+t.version+'</span>'+
        '</div>'+
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
    const field = searchMode === 'designer' ? t.designer : t.name;
    if (!q || field.toLowerCase().indexOf(q)!==-1) {
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

  const timeFormatted = t.time ? t.time.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1年$2月$3日') : '';
  detailMeta.innerHTML =
    '<div class="detail-meta-item"><div class="detail-meta-label">版本</div><div class="detail-meta-value">'+t.version+'</div></div>'+
    '<div class="detail-meta-item"><div class="detail-meta-label">时间</div><div class="detail-meta-value">'+timeFormatted+'</div></div>';

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
      '<span>查看源代码</span>'+
    '</button>';

  if (t.screenshots.length) {
    activeImg = detailMainImg;
    inactiveImg = detailImgB;
    isAnimating = false;
    resetImg(detailMainImg, '1');
    resetImg(detailImgB, '0');
    detailMainImg.src = t.screenshots[0];
    detailImgB.removeAttribute('src');
    detailMainImg.style.display = '';
    detailImgB.style.display = '';
    // 根据图片实际比例设置 hero 宽高比
    const probe = new Image();
    probe.onload = function() {
      if (probe.naturalWidth && probe.naturalHeight) {
        detailHero.style.aspectRatio = probe.naturalWidth + ' / ' + probe.naturalHeight;
      }
    };
    probe.src = t.screenshots[0];
  } else {
    detailMainImg.style.display = 'none';
    detailImgB.style.display = 'none';
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

function switchImg(i, direction) {
  const t = currentTheme;
  if (!t || isAnimating || i === currentIdx) return;
  if (direction === undefined) direction = i > currentIdx ? 1 : -1;
  currentIdx = i;
  const newSrc = t.screenshots[i];
  isAnimating = true;

  const preload = new Image();
  preload.onload = () => {
    inactiveImg.src = newSrc;
    inactiveImg.style.opacity = '1';
    inactiveImg.style.transition = 'none';
    inactiveImg.style.transform = 'translateX(' + (direction * 100) + '%)';
    inactiveImg.offsetHeight;
    inactiveImg.style.transition = '';
    activeImg.style.transform = 'translateX(' + (-direction * 100) + '%)';
    inactiveImg.style.transform = 'translateX(0)';
    setTimeout(() => {
      activeImg.style.transition = 'none';
      activeImg.style.transform = '';
      activeImg.style.opacity = '0';
      activeImg.offsetHeight;
      activeImg.style.transition = '';
      activeImg.removeAttribute('src');
      const tmp = activeImg; activeImg = inactiveImg; inactiveImg = tmp;
      isAnimating = false;
    }, 350);
  };
  preload.onerror = () => { isAnimating = false; };
  preload.src = newSrc;
  detailThumbs.querySelectorAll('.detail-thumb').forEach((d,j)=>d.classList.toggle('active',j===i));
}

// 触屏左右滑动切换图片
const galleryWrap = document.querySelector('.detail-gallery-wrap');
let touchStartX = 0, touchStartY = 0;

galleryWrap.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

galleryWrap.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

galleryWrap.addEventListener('touchend', e => {
  if (!currentTheme || currentTheme.screenshots.length < 2 || isAnimating) return;
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  const len = currentTheme.screenshots.length;
  if (dx > 0) switchImg((currentIdx - 1 + len) % len, -1);
  else switchImg((currentIdx + 1) % len, 1);
}, { passive: true });

function closeDetail() {
  if (!panel.classList.contains('open')) return;
  panel.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  currentTheme = null;
}

searchInput.addEventListener('input',e=>filter(e.target.value));
searchClear.addEventListener('click',()=>{ searchInput.value=''; searchInput.focus(); filter(''); });
searchModeBtn.addEventListener('click',()=>{
  searchMode = searchMode === 'name' ? 'designer' : 'name';
  searchModeBtn.classList.toggle('active', searchMode === 'designer');
  searchInput.placeholder = searchMode === 'designer' ? '搜索设计师…' : '搜索主题名称…';
  searchModeBtn.title = searchMode === 'designer' ? '搜索主题名称' : '搜索设计师';
  filter(searchInput.value);
});

// 搜索框吸顶：下滑缩小，上滑恢复
const searchWrapper = document.querySelector('.search-wrapper');
let lastScroll = 0;
let stickyPoint = 0;

function calcStickyPoint() {
  stickyPoint = searchWrapper.getBoundingClientRect().top + window.pageYOffset;
}
window.addEventListener('load', calcStickyPoint);
window.addEventListener('resize', calcStickyPoint);

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop >= stickyPoint) {
      if (scrollTop > lastScroll + 2) {
        searchWrapper.classList.add('stuck');
      } else if (scrollTop < lastScroll - 2) {
        searchWrapper.classList.remove('stuck');
      }
    } else {
      searchWrapper.classList.remove('stuck');
    }
    lastScroll = scrollTop;
    ticking = false;
  });
}, { passive: true });
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
        version: meta.version||'', time: meta.time||'', description: meta.description||'',
        screenshots,
        download: base+(meta.source||id+'.json'),
        meta: base+'meta.json'
      });
    } catch(e) {}
  }
  renderCards(THEMES);
}).catch(()=>{ renderCards([]); });
