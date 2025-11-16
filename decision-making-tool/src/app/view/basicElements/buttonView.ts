import View from './../view';
import type { SettingsType } from './../../types/SettingsType.ts';

export default class ButtonView extends View {
  constructor(text: string, callback: () => void, additionalClasses: string[] = []) {
    const buttonSettings: SettingsType = {
      tagName: 'button',
      classNames: ['button', ...additionalClasses],
      textContent: text,
      callback: callback,
    };

    super(buttonSettings);
  }
}
