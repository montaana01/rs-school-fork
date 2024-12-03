document.addEventListener('DOMContentLoaded', () => {
    const EXPLORE = document.querySelectorAll('button.explore');

    const HAMBURGER = document.getElementById('hamburger');
    const NAVIGATION = document.getElementById('navigation');
    const BODY = document.body;

    const DAYS = document.getElementById('days');
    const HOURS = document.getElementById('hours');
    const MINUTES = document.getElementById('minutes');
    const SECONDS = document.getElementById('seconds');

    const SCROLL_UP = document.getElementById('up');

    const BEST_GIFTS = document.getElementById('best_gifts');

    HAMBURGER.addEventListener('click', () => {
        NAVIGATION.classList.toggle('header__wrapper__nav-active');
        HAMBURGER.classList.toggle('header__wrapper-hamburger-active');
        NAVIGATION.classList.toggle('xxx', false);
        BODY.classList.toggle('active');
    })

    EXPLORE.forEach(function (item) {
        item.addEventListener("click", function () {
            window.location = './../Gift/';
        });
    });

    function christmasTimer() {
        const NEW_YEAR = new Date(2025, 0, 1);
        console.log(NEW_YEAR);

        const timer = setInterval(function () {
            const NOW = new Date();
            const DIFF = NEW_YEAR - NOW;

            DAYS.textContent = Math.floor(DIFF / (1000 * 60 * 60 * 24));
            HOURS.textContent = Math.floor((DIFF % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            MINUTES.textContent = Math.floor((DIFF % (1000 * 60 * 60)) / (1000 * 60));
            SECONDS.textContent = Math.floor((DIFF % (1000 * 60)) / 1000);
        }, 1000)
    }

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && window.scrollY > 588) {
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

    function getGiftsFromJson(){
        return fetch('./../../assets/json/gifts.json')
            .then(response => response.json())
            .catch(error => {console.error('Error while getting data from JSON:',error)});
    }

    function displayRandomGifts() {
        getGiftsFromJson().then(gifts => {
            const RANDOM = gifts.sort(() => 0.5 - Math.random()).slice(0, 4);
            BEST_GIFTS.innerHTML = RANDOM.map(gift => `
            <div class="best__wrapper__gifts-item ${gift.category.toLowerCase().replace('for ', '')}">
                <img src="./../../assets/images/gifts/gift-${gift.category.toLowerCase().replace(' ', '-')}.png" 
                     class="best__wrapper__gifts-item__img"
                     alt="${gift.name}">
                <div class="best__wrapper__gifts-item__text">
                    <h4 class="${gift.category.toLowerCase().replace('for ', '')}">${gift.category}</h4>
                    <h3>${gift.name}</h3>
                </div>
            </div>
        `).join('');
        });
    }

    const SLIDER = document.getElementById('slider_wrapper');
    const SLIDER_LEFT = document.getElementById('left');
    const SLIDER_RIGHT = document.getElementById('right');

    let currentPosition = 0;
    let slideWidth =  0;
    let clicksToMove = 3;

    window.addEventListener('resize', () => {
        updateClickCount();
        currentPosition = 0;
        initSlider();
        moveSlider(0);
    });

    SLIDER_LEFT.addEventListener('click', () => moveSlider('left'));
    SLIDER_RIGHT.addEventListener('click', () => moveSlider('right'));

    function updateClickCount() {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 768) {
            clicksToMove = 3;
        } else if (screenWidth >= 380) {
            clicksToMove = 6;
        } else {
            clicksToMove = 3;
        }
    }

    function updateButtonState() {
        if (currentPosition === 0) {
            SLIDER_LEFT.classList.add('inactive');
        } else {
            SLIDER_LEFT.classList.remove('inactive');
        }

        if (currentPosition === clicksToMove) {
            SLIDER_RIGHT.classList.add('inactive');
        } else {
            SLIDER_RIGHT.classList.remove('inactive');
        }
    }

    function moveSlider(direction) {
        if (direction === 'right') {
            currentPosition += 1;
        } else if (direction === 'left') {
            currentPosition -= 1;
        }
        if (direction === 0) {
            SLIDER.style.transform = `translateX(0px)`;
        }

        currentPosition = Math.max(0, Math.min(currentPosition, clicksToMove));

        const OFFSET = -currentPosition * slideWidth;
        SLIDER.style.transform = `translateX(${OFFSET}px)`;

        updateButtonState();
    }

    function initSlider() {
        updateClickCount();
        slideWidth = (1993 - SLIDER.offsetWidth) / clicksToMove;
        currentPosition = 0;
        updateButtonState();
    }


    displayRandomGifts();
    christmasTimer();
    initSlider();
});


console.log('CrossCheck Criteria (110 points)\n' +
    'Checking validation of pages: +18\n' +
    'The layout for both pages is validated and error-free according to the W3C Validator (https://validator.w3.org/): +12 (6 points per page)\n' +
    'Valid markup of checked page corresponds to the message "Document checking completed. No errors or warnings to show." In this case, we assign the full points for the checked page (+6).\n' +
    'If there are warnings but no errors, we assign half of the points (+3) for the checked page\n' +
    'Favicon is added to each page: +2\n' +
    'Only one <h1> per each page: +2\n' +
    'The URL of the Gifts page differs from the URL of the Home page (e.g. your-site.com for the Home page and your-site.com/gifts for the Gifts page): +2\n' +
    'The layout matches the design: +46\n' +
    '<header> on each page: +4\n' +
    'Hero section on Home page: +6\n' +
    'About section on Home page: +6\n' +
    'Slider section on Home page: +6\n' +
    'Best Gifts section on Home page: +6\n' +
    'CTA section on Home page: +6\n' +
    'Gifts section on Gifts page: +6\n' +
    '<footer> on each page: +6\n' +
    'CSS Requirements: +10\n' +
    'For positioning gifts in Best Gifts section on Home page and gifts in Gifts section on Gifts page used Flexbox or Grid Layout: +4\n' +
    'When scaling the browser page (<100%) or increasing the page width (>1440px), the layout of both pages is centered rather than shifted to the side and not stretched across the entire width: +4\n' +
    'The empty spaces around the layout are filled with white color: +2\n' +
    'Interactivity: +36\n' +
    'Navigation elements (except CONTACTS) lead to corresponding sections on Home page: +4\n' +
    'CONTACTS in navigation panel links to the <footer> on its own page: +2\n' +
    'Smooth scrolling with anchor links: +2\n' +
    'When clicking on the GIFTS link in <header> and Explore Magical Gifts button in Hero and CTA sections on Home page, it navigates to the Gifts page: +2\n' +
    'The GIFTS link in <header> on Gifts page is non-interactive and don\'t have a hover effects: +2\n' +
    'When clicking on the Logo in <header>, it navigates to the Home page: +2\n' +
    'The active ALL tab in Gifts section of Gifts page is non-interactive and don\'t have a hover effects: +2\n' +
    'Each Gift-card in the Gifts section of the Gifts page, Best Gifts section on Home page and cards in <footer> is interactive when hovering over any area of the card: +6\n' +
    'In the <footer>, clicking on the card CALL US should initiate a phone call: +2\n' +
    'In the <footer>, clicking on the card WRITE US should open the mail client: +2\n' +
    'In the <footer>, clicking on the card MAGIC FOREST should open a new browser tab with Google Maps displaying any location of your choice: +2\n' +
    'In the <footer>, clicking on the link Made in Rolling Scopes School should open the school\'s website in a new tab: +2\n' +
    'Interactivity of the links and buttons is implemented according to the Figma layout. Interactivity includes not only changing cursor\'s appearance, for example, using the cursor: pointer property, but also the use of other visual effects, such as changing the background color or font color, following the Styleguide in the Figma layout. If the interactivity is not specified in the Styleguide, cursor: pointer property is enough: +4\n' +
    'Mandatory requirement for interactivity: smooth change in the appearance of an element on hover, without affecting adjacent elements: +2');
