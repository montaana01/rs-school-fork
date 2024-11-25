const HAMBURGER = document.getElementById('hamburger');
const NAVIGATION = document.getElementById('navigation');
const BODY = document.body;

HAMBURGER.addEventListener('click', () => {
    NAVIGATION.classList.toggle('header__wrapper__nav-open');
    HAMBURGER.classList.toggle('header__wrapper-hamburger-active');
    BODY.classList.toggle('active');
})
