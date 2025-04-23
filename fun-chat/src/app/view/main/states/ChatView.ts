import BaseElementCreator from './../../../factory/BaseElementCreator';
import InputElementCreator from '../../../factory/InputElementCreator';
import type MessageService from '../../../services/websocket/MessageService';
import type AuthService from '../../../services/websocket/AuthService';
import type { ChatMessageType } from '../../../types/server/ChatMessageType';
import type { UserType } from '../../../types/server/UserType';
import ModalView from '../../modal/ModalView';

export default class ChatView {
  public usersSection!: BaseElementCreator<'section'>;
  public dialogSection!: BaseElementCreator<'section'>;
  private toggleUsersBtn!: BaseElementCreator<'button'>;
  private wrapper: BaseElementCreator<'div'>;
  private usersCount!: BaseElementCreator<'h3'>;

  private userElements: Record<string, {
    wrapper: BaseElementCreator<'div'>;
    badge: BaseElementCreator<'span'> | null
  }> = {};

  private sendBox!: BaseElementCreator<'div'>;
  private messageList!: BaseElementCreator<'div'>;
  private dialogHeader!: BaseElementCreator<'h2'>;
  private exitOfDialog!: BaseElementCreator<'button'>;

  private selectedUser: string | null = null;
  private unreadCounters: Record<string, number> = {};
  private messageElements: Record<string, {
    wrapper: BaseElementCreator<'div'>;
    author: BaseElementCreator<'span'>;
    text: BaseElementCreator<'p'>;
    time: BaseElementCreator<'span'>;
    status: BaseElementCreator<'div'>;
    deleteBtn?: BaseElementCreator<'span'>;
  }>;

  private emptyDialogMessage!: BaseElementCreator<'p'>;
  private messageDivider!: BaseElementCreator<'hr'>;
  private dividerInserted: boolean;
  private messageWrapper!: BaseElementCreator<'div'>;
  private messageAuthor!: BaseElementCreator<'span'>;
  private messageTime!: BaseElementCreator<'span'>;
  private messageText!: BaseElementCreator<'p'>;
  private deleteButton!: BaseElementCreator<'span'>;
  private deliveredStatus!: BaseElementCreator<'div'>;
  private messageStatus!: BaseElementCreator<'div'>;

  private messageService: MessageService;
  private authService: AuthService;

  constructor(ms: MessageService, auth: AuthService) {
    this.messageService = ms;
    this.authService = auth;
    this.messageElements = {};
    this.dividerInserted = false;
    this.wrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper','chat__wrapper'],
    });
    this.createView();
    this.registerUserListUpdates();
    void this.loadUsers();
    this.subscribeIncoming();
    this.subscribeMessageEvents();
  }

  public getChat(): HTMLElement {
    return this.wrapper.getCreatedElement();
  }

  private createView(): void {
    this.toggleUsersBtn = new BaseElementCreator({
      tagName: 'button',
      classNames: ['chat__wrapper-users-button', 'button'],
      textContent: '☰'
    });
    this.toggleUsersBtn.getCreatedElement().addEventListener('click', () => this.toggleUsersPanel());
    this.wrapper.addInnerElement(this.toggleUsersBtn.getCreatedElement());


    const users: BaseElementCreator<'section'> = this.createUsers();
    const dialog: BaseElementCreator<'section'> = this.createDialog();
    this.wrapper.addInnerElement(users.getCreatedElement());
    this.wrapper.addInnerElement(dialog.getCreatedElement());
  }

  private toggleUsersPanel(): void {
    const panel = this.usersSection.getCreatedElement();
    panel.classList.toggle('open');
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
    this.dialogHeader = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['chat__wrapper-dialog-header'],
      textContent: 'Select user to open dialog!'
    });
    this.dialogSection.addInnerElement(this.dialogHeader.getCreatedElement());
    this.exitOfDialog = new BaseElementCreator({
      tagName: 'button',
      classNames: ['chat__wrapper-dialog-exit', 'button', 'link'],
      textContent: `Exit`,
    })
    this.exitOfDialog.setCallback(() => this.closeDialog())

    this.messageList = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-dialog-messages']
    });
    this.messageList.getCreatedElement().addEventListener('click', () => this.removeDivider());
    this.sendBox = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-dialog-send']
    });
    this.sendBox.getCreatedElement().addEventListener('click', () => this.removeDivider());
    this.dialogSection.addInnerElement(this.messageList.getCreatedElement());
    this.dialogSection.addInnerElement(this.sendBox.getCreatedElement());
    return this.dialogSection;
  }

  private async loadUsers(): Promise<void> {
    this.usersSection.removeInnerElements();
    this.userElements = {};
    this.usersCount = new BaseElementCreator({
      tagName: 'h3',
      classNames: ['chat__wrapper-users-count'],
      textContent: 'Users: only you',
    });
    this.usersSection.addInnerElement(this.usersCount.getCreatedElement())

    const active: UserType[] = await this.messageService.getActiveUsers();
    const inactive: UserType[] = await this.messageService.getInactiveUsers();
    if (active.length > 1) this.usersCount.setTextContent(`${active.length- 1} users and You!`);

    active.forEach((user: UserType) => this.renderUser(user, true));
    inactive.forEach((user: UserType)  => this.renderUser(user, false));
  }

  private renderUser(user: UserType, isOnline: boolean): void {
    if (user.login === this.authService.currentUser?.login) return;

    const wrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-users-item', isOnline ? 'chat__wrapper-users-item-online' : 'chat__wrapper-users-item-offline'],
    });
    wrapper.getCreatedElement().dataset.userLogin = user.login;

    const userItem: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-users-item', 'link'],
      textContent: `User: ${user.login}`
    });
    userItem.getCreatedElement().addEventListener('click', () => this.openDialog(user.login));
    wrapper.addInnerElement(userItem.getCreatedElement());

    const count: number = this.unreadCounters[user.login] || 0;
    if (count > 0) {
      const unreadMessages : BaseElementCreator<'span'> = new BaseElementCreator({
        tagName: 'span',
        classNames: ['chat__wrapper-users-item-unread'],
        textContent: String(count) });
      wrapper.addInnerElement(unreadMessages.getCreatedElement());
    }
    this.userElements[user.login] = {
      wrapper,
      badge: null
    };
    this.usersSection.addInnerElement(wrapper.getCreatedElement());
  }

  private registerUserListUpdates(): void {
    this.messageService.onUserListUpdate(async () => {
      await this.loadUsers();
      this.updateDialogOnStatusChange();
      this.updateMessagesOnUserStatusChange();
    });
  }

  private updateDialogOnStatusChange(): void {
    if (!this.selectedUser || !this.dialogHeader) return;
    void this.isUserOnline(this.selectedUser).then(isOnline => {
      this.dialogHeader.removeClassNames(['online', 'offline']);
      this.dialogHeader.setClassNames([isOnline ? 'online' : 'offline']);
      this.dialogHeader.setTextContent(`${this.selectedUser} — ${isOnline ? 'online' : 'offline'}`);
    });
  }

  private async openDialog(login: string): Promise<void> {
    if (!this.authService?.currentUser) return;
    if (window.innerWidth <= 550) this.usersSection.getCreatedElement().classList.remove('open');
    this.dialogSection.addInnerElement(this.exitOfDialog.getCreatedElement());
    this.selectedUser = login;
    this.unreadCounters[login] = 0;
    this.updateUnreadBadge(login);
    this.messageList.removeInnerElements();
    this.sendBox.removeInnerElements();
    await this.isUserOnline(login) ? this.dialogHeader.setClassNames(['online']) : this.dialogHeader.setClassNames(['offline']);
    this.dialogHeader.setTextContent(`Dialog of user: ${login}`);
    this.dividerInserted = false;
    this.messageElements = {};
    const messages: ChatMessageType[] = await this.messageService.getMessageHistory(login);
    if (messages.length === 0) {
      this.createEmptyDialogMessage(login);
    } else {
      if (this.emptyDialogMessage) this.emptyDialogMessage.getCreatedElement().remove();
      messages.sort((a: ChatMessageType, b: ChatMessageType) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
      for (const message of messages) {
        const unread: boolean = !message.status.isReaded && message.to === this.authService.currentUser.login;
        if (unread && !this.dividerInserted) {
          this.insertDivider();
        }
        this.renderMessage(message);
      }
      this.scrollToBottom();
      await this.messageService.setAllMessageRead(messages, this.authService.currentUser.login);
    }
    this.setupInput();
  }

  private insertDivider(): void {
    this.messageDivider = new BaseElementCreator({
      tagName: 'hr',
      classNames: ['chat__divider']
    });
    this.messageList.addInnerElement(this.messageDivider.getCreatedElement());
    this.dividerInserted = true;
  }

  private removeDivider(): void {
    if (this.messageDivider) {
      this.messageDivider.getCreatedElement().remove();
      this.dividerInserted = false;
    }
  }

  private scrollToBottom(): void {
    if (!this.selectedUser) return;
    this.messageList.getCreatedElement().scrollTo({
      top: this.messageList.getCreatedElement().scrollHeight,
      behavior: 'smooth'
    });
  }

  private closeDialog(): void {
    this.exitOfDialog.getCreatedElement().remove();
    this.sendBox.removeInnerElements();
    this.dialogHeader.removeClassNames(['online', 'offline'])
    this.selectedUser = null;
    this.messageList.removeInnerElements();
    this.dialogHeader.setTextContent('Select user to open dialog!');
    this.unreadCounters = {};
    this.messageElements = {};
    void this.loadUsers();
  }

  private async isUserOnline(login: string): Promise<boolean> {
    const active: UserType[] = await this.messageService.getActiveUsers();
    return active.some((user: UserType) => user.login === login);
  }

  private updateUnreadBadge(login: string): void {
    const count: number = this.unreadCounters[login] || 0;
    const userElement = this.userElements[login];

    if (!userElement) return;

    if (count > 0) {
      if (!userElement.badge) {
        const badge: BaseElementCreator<'span'> = new BaseElementCreator({
          tagName: 'span',
          classNames: ['chat__user-badge'],
          textContent: String(count)
        });

        userElement.wrapper.addInnerElement(badge.getCreatedElement());
        userElement.badge = badge;
      } else {
        userElement.badge.setTextContent(String(count));
      }
    } else if (userElement.badge) {
      userElement.badge.getCreatedElement().remove();
      userElement.badge = null;
    }
  }

  private renderMessage(message: ChatMessageType): void {
    const isOwn: Boolean = message.from === this.authService.currentUser?.login;
    this.renderMessageTemp();
    this.messageWrapper.getCreatedElement().setAttribute('data-msg-id', message.id);
    this.messageWrapper.setClassNames(['chat__message-item', isOwn ? 'outgoing' : 'incoming']);

    this.messageAuthor.setTextContent(`From: ${message.from}`);
    this.messageAuthor.setClassNames([isOwn ? 'incoming' : 'outgoing']);

    this.messageText.setTextContent(`Text: ${message.text}`);
    this.messageTime.setTextContent(new Date(message.datetime).toLocaleTimeString());
    this.messageStatus.setTextContent(`Read: ${message.status?.isReaded ? '✅' : '❌'}`);
    this.messageStatus.setClassNames([message.status?.isReaded ? 'read' : 'unread']);

    if (isOwn) {
      this.deleteButton.setTextContent('×');
      this.deleteButton.getCreatedElement().addEventListener('click', () => this.deleteMessage(message.id));
      this.deliveredStatus.setTextContent(message.status?.isDelivered ? 'Delivered':'Sent')
    }
    const wrapperElement = this.messageWrapper.getCreatedElement();
    wrapperElement.append(
      this.messageAuthor.getCreatedElement(),
      this.messageText.getCreatedElement(),
      this.messageTime.getCreatedElement(),
      this.deliveredStatus.getCreatedElement(),
      this.messageStatus.getCreatedElement(),
      ...(isOwn ? [this.deleteButton.getCreatedElement()] : [])
    );
    this.messageElements[message.id] = {
      wrapper: this.messageWrapper,
      author: this.messageAuthor,
      text: this.messageText,
      time: this.messageTime,
      status: this.messageStatus,
      deleteBtn: isOwn ? this.deleteButton : undefined
    };
    this.messageList.addInnerElement(wrapperElement);
    this.scrollToBottom();
  }

  private renderMessageTemp(): void {
    this.messageWrapper = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-dialog-messages-item',]
    });

    this.messageAuthor = new BaseElementCreator({
      tagName: 'span',
      classNames: ['chat__wrapper-dialog-messages-item-author'],
    });

    this.messageTime = new BaseElementCreator({
      tagName: 'span',
      classNames: ['chat__wrapper-dialog-messages-item-time'],
    });
    this.messageText = new BaseElementCreator({
      tagName: 'p',
      classNames: ['chat__wrapper-dialog-messages-item-text'],
    });
    this.deliveredStatus = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-dialog-messages-item-delivered'],
    })
    this.messageStatus = new BaseElementCreator({
      tagName: 'div',
      classNames: ['chat__wrapper-dialog-messages-item-status'],
    });

    this.deleteButton = new BaseElementCreator({
      tagName: 'span',
      classNames: ['chat__wrapper-dialog-messages-item-delete'],
      textContent: '×'
    });
  }

  private async deleteMessage(id: string): Promise<void> {
    await this.messageService.deleteMessage(id);
    const elements = this.messageElements[id];
    if (elements) {
      elements.wrapper.getCreatedElement().remove();
      delete this.messageElements[id];
    }
    if (!elements) this.createEmptyDialogMessage(String(this.selectedUser));
  }

  private setupInput(): void {
    const input: InputElementCreator = new InputElementCreator({
      tagName: 'input',
      classNames: ['chat__wrapper-dialog-send__input'],
      placeholder: 'Type a message...',
    })
    const button: BaseElementCreator<'button'> = new BaseElementCreator({
      tagName: 'button',
      classNames: ['chat__wrapper-dialog-send__button', 'button', 'link'],
      textContent: 'send',
      callback: async (): Promise<void> => {
        if (this.selectedUser) await this.sendMessage(input, this.selectedUser);
      }
    });
    input.getCreatedElement().addEventListener('keydown',async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && this.selectedUser) {
        if (this.selectedUser) await this.sendMessage(input, this.selectedUser);
      }
    })
    this.sendBox.addInnerElement(input.getCreatedElement());
    this.sendBox.addInnerElement(button.getCreatedElement());
  }

  private async sendMessage(input: InputElementCreator, selectedUser: string): Promise<void> {
    const text: string = input.getValue().trim();
    if (this.emptyDialogMessage) this.emptyDialogMessage.getCreatedElement().remove();
    if (text.trim().length > 0){
      const isRecipientOnline = await this.isUserOnline(selectedUser);

      const sent: ChatMessageType = await this.messageService.sendMessage(selectedUser, text);
      if (!isRecipientOnline) {
        sent.status.isDelivered = false;
      }
      if (isRecipientOnline) {
        sent.status.isDelivered = true;
      }
      this.renderMessage(sent);
      input.setValue('');
      this.scrollToBottom();
    } else {
      new ModalView('Don\'t try send empty message!')
    }
  }

  private subscribeIncoming(): void {
    this.messageService.onIncoming((message: ChatMessageType) => {
      const isOwnMessage: boolean = message.from === this.authService.currentUser?.login;
      const isCurrentDialog: boolean = message.from === this.selectedUser;

      if (isCurrentDialog) {
        this.renderMessage(message);
        this.scrollToBottom();
      } else if (!isOwnMessage) {
        this.unreadCounters[message.from] = (this.unreadCounters[message.from] || 0) + 1;
        void this.loadUsers();
      }
    });
  }


  private subscribeMessageEvents(): void {
    this.messageService.onDeliveryStatus(({ id }) => {
      const elements = this.messageElements[id];
      if (elements) {
        elements.wrapper.getCreatedElement().classList.add('delivered');
      }
    });

    this.messageService.onReadStatus(({ id, status }) => {
      const elements = this.messageElements[id];
      if (elements) {
        const statusElement = elements.status.getCreatedElement();
        statusElement.textContent = `Read: ${status.isReaded ? '✅' : '❌'}`;
        statusElement.classList.toggle('read', status.isReaded);
        statusElement.classList.toggle('unread', !status.isReaded);
        elements.wrapper.getCreatedElement().classList.add('status-updated');
        setTimeout(() => elements.wrapper.getCreatedElement().classList.remove('status-updated'), 100);
      }
    });

    this.messageService.onEdit(({ id, text, status }) => {
      const elements = this.messageElements[id];
      if (elements) {
        elements.text.getCreatedElement().textContent = text;
        elements.wrapper.getCreatedElement().classList.toggle('edited', status.isEdited);
      }
    });

    this.messageService.onDelete(({ id }) => {
      const elements = this.messageElements[id];
      if (elements) {
        elements.wrapper.getCreatedElement().remove();
        delete this.messageElements[id];
      }
    });
  }

  private createEmptyDialogMessage(login: string = 'selected user'): void {
    this.emptyDialogMessage = new BaseElementCreator({
      tagName: 'p',
      classNames: ['chat__wrapper-dialog-messages-empty'],
      textContent: `Hey ${this.authService.currentUser?.login}, dialog with '${String(login)}' is empty. \n Start messaging now!`,
    })
    this.messageList.addInnerElement(this.emptyDialogMessage.getCreatedElement());
  }

  private updateMessagesOnUserStatusChange(): void {
    if (!this.selectedUser) return;
    void this.isUserOnline(this.selectedUser).then(isOnline => {
      if (!isOnline) return;
      for (const id in this.messageElements) {
        const elements = this.messageElements[id];
        const wrapper = elements.wrapper.getCreatedElement();
        if (elements.author.getCreatedElement().textContent?.includes(this.authService.currentUser?.login ?? '')) {
          wrapper.classList.add('delivered');
        }
      }
    });
  }
}
