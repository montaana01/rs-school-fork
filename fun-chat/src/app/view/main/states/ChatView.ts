import BaseElementCreator from './../../../factory/BaseElementCreator.ts';

export default class ChatView {
  public section: BaseElementCreator<'section'>;
  private readonly wrapper: BaseElementCreator<'div'>;

  constructor() {
    this.section = new BaseElementCreator({
      tagName: 'section',
      classNames: ['section', 'chat'],
    });
    this.wrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper'],
    });
    this.createView();
  }

  public getChat(): HTMLElement {
    return this.section.getCreatedElement();
  }

  private createView(): void {
    const container: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['container'],
    });

    const wrapper: BaseElementCreator<'div'> = this.createChat();

    container.addInnerElement(wrapper.getCreatedElement());
    this.section.addInnerElement(container.getCreatedElement());
  }


  private createChat(): BaseElementCreator<'div'> {
    const chatText: BaseElementCreator<'h2'> = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['chat-text'],
      textContent: 'Chat will be here...',
    });

    this.wrapper.addInnerElement(chatText.getCreatedElement());

    return this.wrapper;
  }
}
