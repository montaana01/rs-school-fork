import BaseElementCreator from './../../../factory/BaseElementCreator.ts';
import ImageElementCreator from './../../../factory/ImageElementCreator.ts';

const ABOUT_APP: string = 'This is new level of chatting. Fun Chat - secured messenger that based on new technology of message delivery.'

export default class AboutView {
  private main_wrapper: BaseElementCreator<'div'>;
  private aboutTop: BaseElementCreator<'section'>;
  private readonly backButton: BaseElementCreator<'button'>;


  constructor() {
    this.main_wrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper', 'main__wrapper-about'],
    });
    this.aboutTop = new BaseElementCreator({
      tagName: 'section',
      classNames: ['main__wrapper-about-top'],
    })
    this.backButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-about-bottom-back', 'link', 'button'],
      textContent: 'Back',
    })
    this.createView();
  }

  public getAbout(): HTMLElement {
    return this.main_wrapper.getCreatedElement();
  }

  public getBackButton(): BaseElementCreator<'button'> {
    return this.backButton;
  }

  private createView(): void {
    const aboutImg: ImageElementCreator = new ImageElementCreator({
      tagName: 'img',
      classNames: ['main__wrapper-about-top-img'],
      src: './icons/main-chat.png',
      alt: 'Fun Chat',
    });
    const aboutText: BaseElementCreator<'p'> = new BaseElementCreator({
      tagName: 'p',
      classNames: ['main__wrapper-about-top-text'],
      textContent: ABOUT_APP,
    });
    const aboutBottom: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-about-bottom'],
    });

    this.aboutTop.addInnerElement(aboutImg.getCreatedElement());
    this.aboutTop.addInnerElement(aboutText.getCreatedElement());
    this.main_wrapper.addInnerElement(this.aboutTop.getCreatedElement());

    aboutBottom.addInnerElement(this.backButton.getCreatedElement());
    this.main_wrapper.addInnerElement(aboutBottom.getCreatedElement());
  }
}
