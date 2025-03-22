import View from './../../view';
import HtmlElementCreator from './../../../services/htmlElementCreator';
import { HtmlInputElementCreator } from '../../../services/htmlInputElementCreator';
import type { SettingsType } from '../../../types/SettingsType';
import ButtonView from './../../basicElements/buttonView';
import StorageManager from '../../../services/storageManager';
import ModalWindow from '../modal/modalView';
import SoundManager from '../../../services/soundManager.ts';
import type { OptionsListItemsType } from '../../../types/OptionsListItemsType';
import { WheelManager } from '../../../services/wheelManager.ts';

export default class DecisionMainStateView extends View {
  private storageManager: StorageManager = StorageManager.getInstance();
  private soundManager: SoundManager = SoundManager.getInstance();
  private soundButtonView!: HTMLElement;
  private backButtonView!: HTMLElement;
  private pickButtonView!: HTMLElement;
  private readonly durationSettings: SettingsType;
  private readonly durationInputView: HtmlInputElementCreator;
  private canvasElement!: HTMLCanvasElement;
  private storageKey: string = 'options';
  private decisionState: string;
  private wheelManager: WheelManager | null = null;
  private pickedWheelElement: HTMLElement | null = null;
  private currentOption!: OptionsListItemsType;

  constructor() {
    const mainWrapperSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper'],
    };
    super(mainWrapperSettings);

    this.storageManager.save('page', 'decision');
    this.durationSettings = {
      tagName: 'input',
      classNames: ['main__wrapper-item__controls-input'],
      placeholder: 'Duration (sec)',
      type: 'number',
    };
    this.durationInputView = new HtmlInputElementCreator(this.durationSettings);

    this.decisionState = 'initial';
    this.storageManager.save('pageState', this.decisionState);

    this.checkValidOptions();
    this.configureView();
  }

  private checkValidOptions(): void {
    const decisionData: OptionsListItemsType[] = this.storageManager.load(this.storageKey) || [];
    if (decisionData.length < 2) {
      window.location.hash = '#/list';
    }
  }

  private configureView(): void {
    const rootElement: HTMLElement = this.elementCreator.getCreatedElement();
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    const titleSettings: SettingsType = {
      tagName: 'h2',
      classNames: ['main__wrapper-item__subtitle'],
      textContent: 'Decision Picker Page',
    };
    this.elementCreator.addInnerHtmlCreatorElement(new HtmlElementCreator(titleSettings));

    this.elementCreator.addInnerHtmlCreatorElement(this.getControlPanelView());

    this.elementCreator.addInnerHtmlCreatorElement(this.getCanvasElementView());
  }

  private toggleControls(disabled: boolean): void {
    const controls: HTMLElement[] = [
      this.backButtonView,
      this.soundButtonView,
      this.durationInputView.element,
      this.pickButtonView,
    ];

    controls.forEach((control: HTMLElement) => {
      if (control) {
        control.tabIndex = disabled ? -1 : 0;
        control.classList.toggle('disabled', disabled);
      }
    });
  }

  private getControlPanelView(): HtmlElementCreator {
    const controlPanelSettings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__controls'],
    };
    const controlPanel: HtmlElementCreator = new HtmlElementCreator(controlPanelSettings);
    const backButton: ButtonView = new ButtonView(
      'Back',
      (): void => {
        window.location.hash = '#/list';
      },
      ['main__wrapper-item__controls-back'],
    );
    this.backButtonView = backButton.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.backButtonView);
    const soundButtonView: ButtonView = new ButtonView('🔊', () => {}, ['main__wrapper-item__controls-sound']);
    this.soundButtonView = soundButtonView.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.soundButtonView);
    this.soundManager.initializeSound(this.soundButtonView);

    controlPanel.addInnerHtmlElement(this.durationInputView.getCreatedElement());

    const pickButton: ButtonView = new ButtonView(
      'Pick',
      (): void => {
        this.startPickingProcess();
      },
      ['main__wrapper-item__controls-pick'],
    );
    this.pickButtonView = pickButton.getHTMLElement();
    controlPanel.addInnerHtmlElement(this.pickButtonView);

    controlPanel.addInnerHtmlCreatorElement(this.getPickedWheelOptionView());
    return controlPanel;
  }

  private getPickedWheelOptionView(): HtmlElementCreator {
    const settings: SettingsType = {
      tagName: 'div',
      classNames: ['main__wrapper-item__controls-subtitle'],
    };
    const element: HtmlElementCreator = new HtmlElementCreator(settings);
    this.pickedWheelElement = element.getCreatedElement();
    this.updatePickedDisplay();
    return element;
  }

  private startPickingProcess(): void {
    if (this.decisionState !== 'initial' && this.decisionState !== 'picked') return;

    const duration: number = Number(this.durationInputView.element.value);
    if (duration < 5) {
      new ModalWindow('Duration must be at least 5 seconds!');
      return;
    }

    this.decisionState = 'picking';
    this.storageManager.save('pageState', this.decisionState);
    this.toggleControls(true);
    this.updatePickedDisplay();

    if (this.wheelManager) {
      this.wheelManager.spin(duration);
    }
  }

  private getCanvasElementView(): HtmlElementCreator {
    const canvasSettings: SettingsType = {
      tagName: 'canvas',
      classNames: ['main__wrapper-item', 'main__wrapper-item__canvas'],
    };
    const canvasElementView: HtmlElementCreator = new HtmlElementCreator(canvasSettings);

    const element = canvasElementView.getCreatedElement();
    if (element instanceof HTMLCanvasElement) {
      this.canvasElement = element;
    } else {
      throw new Error('Canvas element was not created correctly');
    }

    this.canvasElement.setAttribute('height', '400');
    this.canvasElement.setAttribute('width', '400');
    this.initializeWheel();

    return canvasElementView;
  }

  private updatePickedDisplay(): void {
    if (!this.pickedWheelElement) return;
    switch (this.decisionState) {
      case 'initial':
        this.pickedWheelElement.textContent = 'Please set up the picking process!';
        this.pickedWheelElement.classList.remove('highlight');
        break;
      case 'picking':
        this.pickedWheelElement.textContent = this.currentOption?.title || 'Spinning...';
        this.pickedWheelElement.classList.remove('highlight');
        break;
      case 'picked':
        this.pickedWheelElement.textContent = this.currentOption?.title || '';
        this.pickedWheelElement.classList.add('highlight');
        break;
    }
  }

  private initializeWheel(): void {
    const decisionData: OptionsListItemsType[] = this.storageManager.load(this.storageKey) || [];
    const validOptions: OptionsListItemsType[] = decisionData.filter(
      (option: OptionsListItemsType) => option.title && option.weight > 0,
    );

    const canvas: HTMLCanvasElement = this.canvasElement;

    this.wheelManager = new WheelManager(
      canvas,
      validOptions,
      (option: OptionsListItemsType) => {
        this.currentOption = option;
        this.updatePickedDisplay();
      },
      (option: OptionsListItemsType) => {
        this.decisionState = 'picked';
        this.storageManager.save('pageState', this.decisionState);
        this.storageManager.save('decisionWin', option);
        this.updatePickedDisplay();
        this.toggleControls(false);
        if (!this.soundManager.isSoundMuted()) this.soundManager.play();
      },
    );
  }
}
