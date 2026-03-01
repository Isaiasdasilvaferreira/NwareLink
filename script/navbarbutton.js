document.addEventListener('DOMContentLoaded', function() {
  const menuMobile = document.querySelector('.menu-mobile');
  const nav = document.querySelector('.nav');
  
  if (menuMobile && nav) {
    menuMobile.addEventListener('click', function() {
      nav.classList.toggle('ativo');
      menuMobile.classList.toggle('ativo');
      
      const expanded = nav.classList.contains('ativo');
      menuMobile.setAttribute('aria-expanded', expanded);
      
      if (expanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('ativo');
        menuMobile.classList.remove('ativo');
        menuMobile.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !menuMobile.contains(event.target) && nav.classList.contains('ativo')) {
        nav.classList.remove('ativo');
        menuMobile.classList.remove('ativo');
        menuMobile.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
});