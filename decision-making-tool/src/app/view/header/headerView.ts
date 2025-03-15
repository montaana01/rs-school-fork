import './headerView.scss';
import type { SettingsType } from '../../types/SettingsType.ts';
import View from '../view.ts';

export default class HeaderView extends View {
  constructor() {
    const headerSettings: SettingsType = {
      tagName: 'header',
      classNames: ['header'],
      textContent: 'Decision making tool',
      callback: null,
    };
    super(headerSettings);
  }
}
