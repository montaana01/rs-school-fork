import BaseElementCreator from '../../../factory/BaseElementCreator';
import InputElementCreator from '../../../factory/InputElementCreator';
import type AuthService from '../../../services/websocket/AuthService';
import type Router from '../../../services/Router';

export default class AuthView {
  private wrapper: BaseElementCreator<'form'>;
  private loginInput!: InputElementCreator;
  private passwordInput!: InputElementCreator;
  private loginButton!: BaseElementCreator<'button'>;
  private errorLoginMsg!: BaseElementCreator<'span'>;
  private errorPasswordMsg!: BaseElementCreator<'span'>;
  private authService: AuthService;
  private router: Router;

  constructor(auth: AuthService, router: Router) {
    this.authService = auth;
    this.router = router;
    this.wrapper = new BaseElementCreator({
      tagName: 'form',
      classNames: ['main__wrapper', 'main__wrapper-auth'],
    });

    this.createView();
    this.addEventListeners();
  }

  public getAuth(): HTMLElement {
    return this.wrapper.getCreatedElement();
  }

  private createView(): void {
    this.createInputElements();
  }

  private createInputElements(): void {
    this.loginButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-auth__button', 'button',  'disabled'],
      textContent: 'Login',
    });
    this.wrapper.addInnerElement(this.createLogin().getCreatedElement());
    this.wrapper.addInnerElement(this.createPassword().getCreatedElement());
    this.wrapper.addInnerElement(this.loginButton.getCreatedElement());
  }


  private addEventListeners(): void {
    this.loginInput.getCreatedElement().addEventListener('input', () => {
      this.validateLogin();
      this.updateButtonState();
    });
    this.passwordInput.getCreatedElement().addEventListener('input', () => {
      this.validatePassword();
      this.updateButtonState();
    });

    const formElement: HTMLFormElement = this.wrapper.getCreatedElement();
    formElement.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();
      void this.handleSubmit();
    });



    this.wrapper.getCreatedElement().addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !this.loginButton.getCreatedElement().classList.contains('disabled')) {
        event.preventDefault();
        void this.handleSubmit();
      }
    });
  }

  private validateLogin(): boolean {
    const value: string = this.loginInput.getValue().trim();
    if (value == this.passwordInput.getValue()) {
      this.errorPasswordMsg.setTextContent('Password must be different from the login.');
      return false;
    }
    const isValid: boolean = /^[a-zA-Zа-яА-Я0-9]{3,}$/.test(value);
    if (!isValid) {
      this.errorLoginMsg.setTextContent('Login must be at least 3 alphanumeric characters.');
    } else {
      this.errorLoginMsg.setTextContent('');
    }
    return isValid;
  }

  private validatePassword(): boolean {
    const passwordValue: string = this.passwordInput.getValue();
    if (passwordValue === this.loginInput.getValue()) {
      this.errorPasswordMsg.setTextContent('Password must be different from the login.');
      return false;
    }
    const isValid: boolean = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(passwordValue);
    if (!isValid) {
      this.errorPasswordMsg.setTextContent('Password must be at least 6 characters, including letters and numbers.');
    } else {
      this.errorPasswordMsg.setTextContent('');
    }
    return isValid;
  }

  private updateButtonState(): void {
    if (this.validateLogin() && this.validatePassword()) {
      this.loginButton.removeClassNames(['disabled']);
    } else {
      this.loginButton.setClassNames(['disabled']);
    }
  }

  private async handleSubmit(): Promise<void> {
    try {
      await this.authService.login(
        this.loginInput.getValue().trim(),
        this.passwordInput.getValue()
      );
      await this.router.navigate('/main');
    } catch (error) {
      throw new Error(`Login failed ${error}`);
    }
  }

  private createLogin(): BaseElementCreator<'div'> {
    const loginWrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-auth-block'],
    })
    this.loginInput = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-auth-block__input',],
      type: 'text',
      placeholder: 'Login',
    });
    this.errorLoginMsg = new BaseElementCreator({
      tagName: 'span',
      classNames: ['main__wrapper-auth-block__message'],
    });
    loginWrapper.addInnerElement(this.loginInput.getCreatedElement());
    loginWrapper.addInnerElement(this.errorLoginMsg.getCreatedElement());
    return loginWrapper;
  }

  private createPassword(): BaseElementCreator<'div'> {
    const passwordWrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-auth-block'],
    });
    this.passwordInput = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-auth-block__input'],
      type: 'password',
      placeholder: 'Password',
    });
    this.errorPasswordMsg = new BaseElementCreator({
      tagName: 'span',
      classNames: ['main__wrapper-auth-block__message'],
    });

    passwordWrapper.addInnerElement(this.passwordInput.getCreatedElement());
    passwordWrapper.addInnerElement(this.errorPasswordMsg.getCreatedElement());
    return passwordWrapper;
  }
}
