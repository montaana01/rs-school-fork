import './ThemeSwitcherView.scss'
import StorageManager from '../../../services/StorageManager';
import BaseElementCreator from '../../../factory/BaseElementCreator';
import type { StorageType } from '../../../types/StorageType';
import type { BaseElementCreatorType } from '../../../types/BaseElementCreatorType';
import type { ThemeType } from '../../../types/ThemeType';

export default class ThemeSwitcherView {
  public point!: BaseElementCreator<'span'>;
  private element: BaseElementCreatorType<'div'>;
  private storage: StorageType;
  constructor() {
    this.element = new BaseElementCreator({
      tagName: 'div',
      classNames: ['header__wrapper-item', 'header__wrapper-item__switcher', 'theme-switcher'],
    });
    this.storage = StorageManager.getManager();
    this.createView();
  }

  public init(themeManager: ThemeType): void {
    this.updateView();
    this.point.setCallback(() => this.toggleTheme(themeManager));
  }

  public getCreatedElement(): HTMLElement {
    return this.element.getCreatedElement();
  }

  public toggleTheme(themeManager: ThemeType): void {
    themeManager.toggleTheme();
    this.updateView();
  }

  private updateView(): void {
    this.element.getCreatedElement().setAttribute('data-theme', this.storage.load('theme'));
    this.point.setTextContent(this.storage.load('theme'));
  }

  private createView(): void {
    this.point = new BaseElementCreator({
      tagName: 'span',
      classNames: ['theme-switcher__point'],
    })

    this.element.addInnerElement(this.point.getCreatedElement());
  }
}
