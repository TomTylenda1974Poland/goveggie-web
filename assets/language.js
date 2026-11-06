/* Both sites use ES/EN. An explicit incoming selection wins over a saved preference. */
const gvLocale = (() => {
  function save(lang) {
    try { localStorage.setItem('gv-lang', lang); } catch {}
  }

  function initial() {
    const requested = new URL(location.href).searchParams.get('lang');
    if (requested === 'en' || requested === 'es') {
      save(requested);
      return requested;
    }
    try { return localStorage.getItem('gv-lang') === 'en' ? 'en' : 'es'; }
    catch { return 'es'; }
  }

  function choose(lang) {
    save(lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(history.state, '', url);
  }

  function updateLinks(lang) {
    for (const link of document.querySelectorAll('a[data-palapa-path]')) {
      link.href = 'https://palapa-verde.vercel.app/' + lang + link.dataset.palapaPath;
    }
    // Keep the language when navigating with storage disabled or opening links in a new tab.
    for (const link of document.querySelectorAll('a[href]')) {
      const href = link.getAttribute('href');
      if (!/^[\w-]+\.html(?:[?#]|$)/.test(href)) continue;
      const url = new URL(href, location.href);
      url.searchParams.set('lang', lang);
      link.setAttribute('href', url.pathname.split('/').pop() + url.search + url.hash);
    }
  }

  return { initial, choose, updateLinks };
})();
