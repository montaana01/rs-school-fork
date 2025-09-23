document.addEventListener('DOMContentLoaded', () => {
    const HAMBURGER = document.getElementById('hamburger');
    const NAVIGATION = document.getElementById('navigation');
    const BODY = document.body;

    const SCROLL_UP = document.getElementById('up');

    const GIFTS = document.getElementById('gifts_wrapper');
    const SELECTORS = document.querySelectorAll('.gift__wrapper__selector-item');


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

    function getGiftsFromJson(){
        return fetch('./../../assets/json/gifts.json')
            .then(response => response.json())
            .catch(error => {console.error('Error while getting data from JSON:',error)});
    }

    function displayGifts(gifts) {
        const RANDOM = gifts.sort(() => 0.5 - Math.random());
        GIFTS.innerHTML = RANDOM.map(gift => `
        <div class="gift__wrapper__gifts-item ${gift.category.toLowerCase().replace('for ', '')}">
          <img src="./../../assets/images/gifts/gift-${gift.category.toLowerCase().replace(' ', '-')}.png"
               class="gift__wrapper__gifts-item__img" alt="${gift.name}">
          <div class="gift__wrapper__gifts-item__text">
            <h4 class="${gift.category.toLowerCase().replace('for ', '')}">${gift.category}</h4>
            <h3>${gift.name}</h3>
          </div>
        </div>
      `).join('');
    }

    getGiftsFromJson().then(gifts => {
        displayGifts(gifts);
    });

    SELECTORS.forEach(item => {
        item.addEventListener('click', handleCategoryClick);
    });

    function handleCategoryClick(e) {
        if (e.target.classList.contains('gift__wrapper__selector-item')) {
            const CATEGORY = e.target.getAttribute('data-category');
            SELECTORS.forEach(item => item.classList.remove('gift__wrapper__selector-item__active'));
            e.target.classList.add('gift__wrapper__selector-item__active');
            filterGiftsByCategory(CATEGORY);
        }
    }

    function filterGiftsByCategory(category) {
        getGiftsFromJson().then(gifts => {
            if (category === 'all') {
                displayGifts(gifts);
            } else {
                const FILTERED = gifts.filter(gift => gift.category.toLowerCase().includes(category));
                displayGifts(FILTERED);
            }
        });
    }

});
