'use strict';
(() => {
  const data = JSON.parse(document.getElementById('book-data').textContent);
  const es = document.documentElement.lang === 'es';
  const t = (spanish, english) => es ? spanish : english;
  const el = id => document.getElementById(id);
  const url = new URL(location.href);
  const saveKey = 'gv-cookbook-saved-v1';
  let saved = new Set();
  try {
    const entries = JSON.parse(localStorage.getItem(saveKey) || '[]');
    if (Array.isArray(entries)) saved = new Set(entries.filter(s => typeof s === 'string'));
    localStorage.setItem('gv-lang', es ? 'es' : 'en');
  } catch {}
  function updateURL() {
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    const alternate = new URL(el('lang').href);
    alternate.search = url.search;
    alternate.hash = url.hash;
    el('lang').href = alternate.href;
  }
  function param(key, value) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  document.documentElement.classList.add('enhanced');
  if (data.type === 'index') {
    const toggle = el('filter-toggle');
    function openFilters(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.lastElementChild.textContent = open ? '−' : '＋';
    }
    toggle.addEventListener('click',()=>openFilters(toggle.getAttribute('aria-expanded')!=='true'));
    openFilters([...url.searchParams.keys()].some(k=>k!=='q'));

    const controls = ['q','cocina','momento','dieta','producto','familia','rapidas','guardadas'].map(el);
    const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[-‐–]/g,' ');
    const cards = Array.from(document.querySelectorAll('.card')).map(card => {
      const item = data.items[card.dataset.slug];
      const words = normalize([card.innerText,card.querySelector('h3').textContent,item.names,...item.products.map(p=>data.products[p])].join(' '));
      return {card,item,words,link:card.querySelector('a')};
    });
    const get = key => url.searchParams.get(key) || '';
    for (const node of controls) {
      if (node.type === 'checkbox') node.checked = get(node.id)==='1';
      else node.value = get(node.id);
    }
    let limit = 12;
    function render() {
      const phrase = normalize(el('q').value.trim());
      const words = phrase.split(/\s+/).filter(Boolean);
      const sku = el('producto').value;
      const typedSku = phrase && Object.keys(data.products).find(p => normalize(data.products[p])===phrase || normalize(p)===phrase);
      const activeSku = sku || typedSku;
      const diet=el('dieta').value;
      let count=0;
      for (const {card,item,link,words: haystack} of cards) {
        const matches = words.every(s=>haystack.includes(s))
          && (!sku || item.products.includes(sku))
          && (!el('cocina').value || el('cocina').value === item.cuisine)
          && (!el('momento').value || item.meals.includes(el('momento').value))
          && (diet!=='vegan' || item.vegan) && (diet!=='ovo' || !item.vegan) && (diet!=='dairyfree' || item.dairyfree)
          && (!el('familia').checked || item.kids) && (!el('rapidas').checked || item.minutes<=30)
          && (!el('guardadas').checked || saved.has(card.dataset.slug));
        if (matches) count++;
        card.hidden = !matches || count>limit;
        const target=new URL(link.href);
        target.search = '';
        if (activeSku && item.products.includes(activeSku)) target.searchParams.set('producto',activeSku);
        link.href=target.href;
      }
      el('result').textContent = count+' '+(count===1?t('receta','recipe'):t('recetas','recipes'));
      el('empty').hidden = count!==0;
      if (!count) el('empty').textContent = el('guardadas').checked && !saved.size
        ? t('Guarda una receta desde su página para encontrarla aquí.','Save a recipe on its page to find it here.')
        : t('Prueba con otro ingrediente o quita un filtro.','Try a different ingredient or clear a filter.');
      el('more').hidden = count<=limit;
      el('clear').hidden=!controls.some(n=>n.type==='checkbox'?n.checked:n.value);
    }
    function filter() {
      limit=12;
      for(const node of controls) param(node.id,node.type==='checkbox'?(node.checked?'1':''):node.value.trim());
      updateURL(); render();
    }
    el('filters').addEventListener('input',filter);
    el('filters').addEventListener('submit',e=>{e.preventDefault();filter();});
    el('clear').addEventListener('click',()=>{el('filters').reset();filter();});
    el('more').addEventListener('click',()=>{
      const previouslyVisible=new Set(cards.filter(({card})=>!card.hidden));
      limit+=12;render();
      cards.find(entry=>!entry.card.hidden&&!previouslyVisible.has(entry))?.link.focus({preventScroll:true});
    });
    window.addEventListener('pageshow',() => {
      try {const v=JSON.parse(localStorage.getItem(saveKey)||'[]'); if(Array.isArray(v)) saved=new Set(v);} catch {}
      render();
    });
    updateURL();render();
    return;
  }

  const portions = el('servings');
  const variety = el('variety');
  const checkboxes = [...document.querySelectorAll('[data-have]')];
  const feedback = el('feedback');
  const fav=document.querySelector('.fav');
  function drawFavorite(){
    fav.setAttribute('aria-pressed',String(saved.has(data.slug)));
    fav.textContent=saved.has(data.slug)?t('✓ Guardada en este dispositivo','✓ Saved on this device'):t('Guardar receta','Save recipe');
  }
  fav.addEventListener('click',()=>{
    const next=new Set(saved);
    if(next.has(data.slug)) next.delete(data.slug); else next.add(data.slug);
    try {localStorage.setItem(saveKey,JSON.stringify([...next]));saved=next;drawFavorite();}
    catch {fav.textContent=t('El navegador no permite guardar','Saving is disabled in this browser');}
  });
  if (Object.hasOwn(data.products,url.searchParams.get('producto'))) variety.value=url.searchParams.get('producto');
  if ([2,4,6,8].includes(Number(url.searchParams.get('porciones')))) portions.value=url.searchParams.get('porciones');
  const format=new Intl.NumberFormat(es?'es-DO':'en',{maximumFractionDigits:2});
  let shareText='';
  function shopping() {
    const list=[];
    const slug=variety.value;
    data.lines.forEach((line,i)=>{
      const amount=format.format(line.q*Number(portions.value)/2)+line.u;
      const variant=line.products.includes(slug)?data.products[slug]:'';
      document.querySelector('[data-qty="'+i+'"]').textContent=amount;
      document.querySelector('[data-choice="'+i+'"]').textContent=variant;
      const illustration=document.querySelector('[data-variant-art="'+i+'"]');
      illustration.hidden=!variant;
      if (variant) illustration.src='/assets/cocina/productos/'+slug+'.webp';
      if (!checkboxes[i].checked) list.push('• '+amount+' '+line.n+(variant?' ('+variant+')':''));
    });
    const recipeLink=new URL(location.pathname,location.origin);
    recipeLink.searchParams.set('porciones',portions.value);
    if(slug) recipeLink.searchParams.set('producto',slug);
    shareText=[document.querySelector('h1').textContent+' · '+portions.value+' '+t('porciones','servings'),...list,recipeLink.href].join('\n');
    const wa=el('wa');
    wa.href='https://wa.me/?text='+encodeURIComponent(shareText);
    wa.hidden=el('copy').hidden=list.length===0;
    el('manual-wrap').hidden=true;
    feedback.textContent=list.length?'':t('Ya tienes todos los ingredientes.','You already have every ingredient.');
    el('catalog-link').hidden=!slug;
    if(slug) el('catalog-link').href='https://catalog.goveggie.life/producto/'+encodeURIComponent(slug);
    param('porciones',portions.value==='2'?'':portions.value);
    param('producto',slug);updateURL();
  }
  portions.addEventListener('change',shopping);
  variety.addEventListener('change',shopping);
  for (const box of checkboxes) box.addEventListener('change',shopping);
  el('copy').addEventListener('click',async()=>{
    try {
      await navigator.clipboard.writeText(shareText);
      feedback.textContent=t('Lista copiada.','List copied.');
    } catch {
      el('manual-wrap').hidden=false;
      el('manual').value=shareText;
      el('manual').focus();el('manual').select();
    }
  });
  drawFavorite();shopping();
})();
