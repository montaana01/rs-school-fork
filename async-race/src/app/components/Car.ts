import './cars.scss';

import BaseElementCreator from '../factory/html/BaseElementCreator';
import ImageElementCreator from '../factory/html/ImageElementCreator';

export default class Car {
  public selectButton!: BaseElementCreator<'button'>;
  public removeButton!: BaseElementCreator<'button'>;
  public startButton!: BaseElementCreator<'button'>;
  public stopButton!: BaseElementCreator<'button'>;

  private car!: BaseElementCreator<'tr'>;

  private racetrack!: BaseElementCreator<'div'>;
  private carImageElement!: BaseElementCreator<'img'>;

  private readonly name: string;
  private readonly color: string;
  private readonly id: number;

  constructor(name: string, color: string, id: number) {
    this.name = name;
    this.color = color;
    this.id = id;

    this.createView();
  }

  public getCar(): HTMLElement {
    return this.car.getCreatedElement();
  }

  public getCarId(): number {
    return this.id;
  }

  public getCarName(): string {
    return this.name;
  }

  public getCarImageElement(): BaseElementCreator<'img'> {
    return this.carImageElement;
  }

  public getRaceTrackElement(): BaseElementCreator<'div'> {
    return this.racetrack;
  }

  private createView(): void {
    this.car = new BaseElementCreator({
      tagName: 'tr',
      classNames: ['cars__wrapper-item', 'car'],
    });

    const position: BaseElementCreator<'h3'> = new BaseElementCreator({
      tagName: 'h3',
      classNames: ['cars__wrapper-item-position'],
      textContent: this.id.toString(),
    });
    const carWrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['cars__wrapper-item-wrapper'],
    });

    const buttonsAndBrands: BaseElementCreator<'div'> = this.getButtonsAndBrand();
    const raceTrack: BaseElementCreator<'div'> = this.getRaceTrack();

    carWrapper.addInnerElement(buttonsAndBrands.getCreatedElement());
    carWrapper.addInnerElement(raceTrack.getCreatedElement());

    this.car.addInnerElement(position.getCreatedElement());
    this.car.addInnerElement(carWrapper.getCreatedElement());
  }

  private getButtonsAndBrand(): BaseElementCreator<'div'> {
    const buttonsAndBrands: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['cars__wrapper-item-wrapper__bb'],
    });

    const brand: BaseElementCreator<'h2'> = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['cars__wrapper-item-wrapper__bb-brand'],
      textContent: this.name,
    });
    const buttons: BaseElementCreator<'div'> = this.getButtons();

    buttonsAndBrands.addInnerElement(buttons.getCreatedElement());
    buttonsAndBrands.addInnerElement(brand.getCreatedElement());

    return buttonsAndBrands;
  }

  private getButtons(): BaseElementCreator<'div'> {
    const buttonsWrapper: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['cars__wrapper-item-wrapper__bb-buttons'],
    });

    this.selectButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['cars__wrapper-item-wrapper__bb-buttons-item', 'button', 'select'],
      textContent: 'select',
    });
    this.removeButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['cars__wrapper-item-wrapper__bb-buttons-item', 'button', 'remove'],
      textContent: 'remove',
    });
    this.startButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['cars__wrapper-item-wrapper__bb-buttons-item', 'button', 'start'],
      textContent: 'A',
    });
    this.stopButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['cars__wrapper-item-wrapper__bb-buttons-item', 'button', 'stop', 'disabled'],
      textContent: 'B',
    });

    buttonsWrapper.addInnerElement(this.selectButton.getCreatedElement());
    buttonsWrapper.addInnerElement(this.removeButton.getCreatedElement());
    buttonsWrapper.addInnerElement(this.startButton.getCreatedElement());
    buttonsWrapper.addInnerElement(this.stopButton.getCreatedElement());

    return buttonsWrapper;
  }

  private getRaceTrack(): BaseElementCreator<'div'> {
    this.racetrack = new BaseElementCreator({
      tagName: 'div',
      classNames: ['cars__wrapper-item-wrapper__track'],
    });

    //todo: replace with svg with wheels and different colors
    this.carImageElement = new ImageElementCreator({
      tagName: 'img',
      classNames: ['cars__wrapper-item-wrapper__track-img', this.color],
      src: './cars/porsche.svg',
      alt: this.name,
    });
    this.racetrack.addInnerElement(this.carImageElement.getCreatedElement());
    return this.racetrack;
  }
}
