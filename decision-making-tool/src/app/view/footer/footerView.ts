import './footerView.scss';
import type { SettingsType } from '../../types/SettingsType.ts';
import View from '../view.ts';

export default class FooterView extends View {
  constructor() {
    const footerSettings: SettingsType = {
      tagName: 'footer',
      classNames: ['footer'],
      textContent: 'The Rolling Scopes School',
      callback: null,
    };
    super(footerSettings);
  }
}
