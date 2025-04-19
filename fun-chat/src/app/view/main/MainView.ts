import './mainView.scss'
import BaseElementCreator from '../../factory/BaseElementCreator.ts';
import ImageElementCreator from '../../factory/ImageElementCreator.ts';

const ABOUT_APP: string = 'This is new level of chatting. Fun Chat - secured messenger that based on new technology of message delivery.'
const LOGIN_TEXT: string = 'Log in to Fun Chat';
const REGISTRATION_TEXT: string = 'Don\'t have a Fun Chat account?';

export default class MainView {
  public main: BaseElementCreator<'main'>;
  public loginButton: BaseElementCreator<'button'>;
  public registrationButton: BaseElementCreator<'button'>;
  private aboutText: BaseElementCreator<'p'>;


  constructor() {
    this.main = new BaseElementCreator({
      tagName: 'main',
      classNames: ['main'],
    });
    this.aboutText = new BaseElementCreator({
      tagName: 'p',
      classNames: ['main__wrapper-about-text'],
      textContent: ABOUT_APP,
    })
    this.loginButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-authentication-button', 'button'],
      textContent: 'login'
    })
    this.registrationButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-authentication-button', 'button'],
      textContent: 'registration'
    })
    this.createView();
  }

  public getMain(): HTMLElement {
    return this.main.getCreatedElement();
  }

  private createView(): void {
    const container: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });

    const wrapper: BaseElementCreator<'div'> = this.createWrapper();

    container.addInnerElement(wrapper.getCreatedElement());
    this.main.addInnerElement(container.getCreatedElement());
  }

  private createWrapper(): BaseElementCreator<'div'> {
    const wrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper'],
    });

    wrapper.addInnerElement(this.creteAbout());
    wrapper.addInnerElement(this.createAuthentication());

    return wrapper;
  }

  private creteAbout(): HTMLElement {
    const about: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-about'],
    });

    const aboutImg: ImageElementCreator = new ImageElementCreator({
      tagName: 'img',
      classNames: ['main__wrapper-about-img'],
      src: './icons/main-chat.png',
      alt: 'Fun Chat',
    })

    about.addInnerElement(aboutImg.getCreatedElement());
    about.addInnerElement(this.aboutText.getCreatedElement());

    return about.getCreatedElement();
  }

  private createAuthentication(): HTMLElement {
    const authenticationBox: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main', 'main__wrapper-item', 'main__wrapper-authentication'],
    });

    const loginText: BaseElementCreator<'h3'> = new BaseElementCreator({
      tagName: 'h3',
      classNames: ['main__wrapper-authentication-text'],
      textContent: LOGIN_TEXT,
    });
    authenticationBox.addInnerElement(loginText.getCreatedElement());
    authenticationBox.addInnerElement(this.loginButton.getCreatedElement());
    const registrationText: BaseElementCreator<'p'> = new BaseElementCreator({
      tagName: 'p',
      classNames: ['main__wrapper-authentication-text'],
      textContent: REGISTRATION_TEXT,
    });
    authenticationBox.addInnerElement(registrationText.getCreatedElement());
    authenticationBox.addInnerElement(this.registrationButton.getCreatedElement());

    return authenticationBox.getCreatedElement();
  }
}
