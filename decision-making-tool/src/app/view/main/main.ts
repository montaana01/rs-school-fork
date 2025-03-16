import View from '../view.ts';
import type { SettingsType } from '../../types/SettingsType.ts';
import decisionMakingToolLogo from '*.png';

export default class MainView extends View {
  constructor() {
    const mainSettings: SettingsType = {
      tagName: 'main',
      classNames: ['main'],
    };
    super(mainSettings);
    //todo: remove this hardcode sh#t
    document.querySelector<HTMLDivElement>('main')!.innerHTML = `
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="${decisionMakingToolLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
          <img src="${decisionMakingToolLogo}" class="logo vanilla" alt="TypeScript logo" />
        </a>
      </div>
    `;
  }
}
