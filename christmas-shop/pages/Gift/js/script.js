document.addEventListener('DOMContentLoaded', () => {
    const HAMBURGER = document.getElementById('hamburger');
    const NAVIGATION = document.getElementById('navigation');
    const BODY = document.body;

    const SCROLL_UP = document.getElementById('up');

    HAMBURGER.addEventListener('click', () => {
        NAVIGATION.classList.toggle('header__wrapper__nav-open');
        HAMBURGER.classList.toggle('header__wrapper-hamburger-active');
        BODY.classList.toggle('active');
    })

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && window.scrollY > 300) {
            SCROLL_UP.classList.add('show');
            console.log('h');
        } else {
            SCROLL_UP.classList.remove('show');
        }
    });

    SCROLL_UP.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
