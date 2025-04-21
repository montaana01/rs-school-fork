import BaseElementCreator from './../../../factory/BaseElementCreator.ts';

export default class ChatView {
  public usersSection!: BaseElementCreator<'section'>;
  public dialogSection!: BaseElementCreator<'section'>;
  private readonly wrapper: BaseElementCreator<'div'>;

  constructor() {
    this.wrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper','chat__wrapper'],
    });
    this.createView();
  }

  public getChat(): HTMLElement {
    return this.wrapper.getCreatedElement();
  }

  private createView(): void {
    const users: BaseElementCreator<'section'> = this.createUsers();
    const dialog: BaseElementCreator<'section'> = this.createDialog();
    this.wrapper.addInnerElement(users.getCreatedElement());
    this.wrapper.addInnerElement(dialog.getCreatedElement());
  }


  private createUsers(): BaseElementCreator<'section'> {
    this.usersSection = new BaseElementCreator({
      tagName: 'section',
      classNames: ['chat__wrapper-users'],
    });
    return this.usersSection;
  }

  private createDialog(): BaseElementCreator<'section'> {
    this.dialogSection = new BaseElementCreator({
      tagName: 'section',
      classNames: ['chat__wrapper-dialog'],
    });

    const chatText: BaseElementCreator<'h2'> = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['chat__wrapper-dialog__message'],
      textContent: 'Chat will be here...',
    });
    this.dialogSection.addInnerElement(chatText.getCreatedElement());
    return this.dialogSection;
  }
}
