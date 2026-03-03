(function(){
  const KEY = 'site-theme';
  const toggle = document.querySelector('.toggle-control input[type="checkbox"]');

  function applyTheme(name){
    const isDark = name === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (logo) {
      logo.src = isDark ? './logo/logo_500px_dm.svg' : './logo/logo_500px.svg';
    }
    if (homepage_pidgeon) {
      homepage_pidgeon.src = isDark ? './img/pidgeon-dark.png' : './img/homepage_pidgeon.png';
    }
  }

  
  const logo = document.querySelector('.logo-img');
  const homepage_pidgeon = document.querySelector('#homepage_pidgeon');
  const saved = localStorage.getItem(KEY);
  // default to light if nothing saved
  const start = saved || 'light';
  applyTheme(start);
  if(toggle) toggle.checked = start === 'dark';

  if(!toggle) return;
  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
  });
})();