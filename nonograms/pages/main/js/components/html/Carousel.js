import { CreateHTMLElement } from "./../CreateHTMLElement.js";

export class Carousel {
  constructor(solutions) {
    this.carouselData = solutions;
    this.currentSlide = 0;
    this.currentDifficulty = localStorage.getItem("difficulty");
    this.imagePath = "./../../assets/images/slider/";
    this.carouselElement = new CreateHTMLElement("div", {
      className: "game__carousel__wrapper",
    });
    window.addEventListener("difficultyUpdated", () => this.updateCarousel());
    this.init();
  }

  init() {
    this.createDOM();
    this.updateCarousel();
  }

  createDOM() {
    this.caption = new CreateHTMLElement("div", {
      className: "game__carousel__wrapper__text",
    });
    this.caption.appendChildTo(this.carouselElement.element);

    this.slidesContainer = new CreateHTMLElement("div", {
      className: "game__carousel__wrapper__slides",
    });
    this.slidesContainer.appendChildTo(this.carouselElement.element);

    const navContainer = new CreateHTMLElement("div", {
      className: "game__carousel__wrapper__nav",
    });
    navContainer.appendChildTo(this.carouselElement.element);

    this.prevButton = new CreateHTMLElement("button", {
      className: "game__carousel__wrapper__button",
      content: "❮",
    });
    this.prevButton.appendChildTo(navContainer.element);

    this.nextButton = new CreateHTMLElement("button", {
      className: "game__carousel__wrapper__button",
      content: "❯",
    });

    this.nextButton.appendChildTo(navContainer.element);

    this.prevButton.element.addEventListener("click", () => {
      const templates =
        this.carouselData &&
        this.carouselData[this.currentDifficulty] &&
        this.carouselData[this.currentDifficulty].templates;
      const templateCount = templates ? templates.length : 0;

      this.currentSlide =
        (this.currentSlide - 1 + templateCount) % templateCount;
      this.showCurrentSlide();
    });

    this.nextButton.element.addEventListener("click", () => {
      const templates =
        this.carouselData &&
        this.carouselData[this.currentDifficulty] &&
        this.carouselData[this.currentDifficulty].templates;
      const templateCount = templates ? templates.length : 0;

      this.currentSlide = (this.currentSlide + 1) % templateCount;
      this.showCurrentSlide();
    });

    this.startButton = new CreateHTMLElement("button", {
      className: "game__carousel__wrapper__button-start",
      content: "START",
    });
    this.startButton.appendChildTo(this.carouselElement.element);
    this.startButton.element.addEventListener("click", () => {
      const difficulty = localStorage.getItem("difficulty") || "easy";
      const templates =
        (this.carouselData[difficulty] &&
          this.carouselData[difficulty].templates) ||
        [];

      window.dispatchEvent(
        new CustomEvent("gameStart", {
          detail: {
            difficulty: difficulty,
            levelName: templates[this.currentSlide].name,
          },
        })
      );
    });
  }

  updateCarousel() {
    const difficulty = localStorage.getItem("difficulty");

    if (difficulty === this.currentDifficulty) {
      this.createSlides();
      this.showCurrentSlide();
      return;
    }

    this.currentDifficulty = difficulty;
    this.currentSlide = 0;
    this.slidesContainer.element.textContent = "";
    this.createSlides();
    this.showCurrentSlide();
  }

  createSlides() {
    const difficultyData =
      this.carouselData && this.carouselData[this.currentDifficulty];
    const templates = (difficultyData && difficultyData.templates) || [];

    templates.forEach((template) => {
      const slide = new CreateHTMLElement("div", {
        className: "game__carousel__wrapper__slides-slide",
      });
      slide.appendChildTo(this.slidesContainer.element);

      const img = new CreateHTMLElement("img", {
        className: "game__carousel__wrapper__slides-slide__img",
        attributes: {
          src: this.imagePath + template.url,
          alt: (template.name || "Unknown") + " nonogram",
        },
      });
      img.appendChildTo(slide.element);
    });
  }

  showCurrentSlide() {
    const slides = this.slidesContainer.element.children;
    const difficultyData =
      this.carouselData && this.carouselData[this.currentDifficulty];
    const templates = (difficultyData && difficultyData.templates) || [];

    Array.from(slides).forEach((slide, index) => {
      slide.classList.toggle("active", index === this.currentSlide);
    });

    this.caption.element.textContent = templates[this.currentSlide].name;
    localStorage.setItem("currentLevel", templates[this.currentSlide].name);
  }

  getElement() {
    return this.carouselElement;
  }
}
