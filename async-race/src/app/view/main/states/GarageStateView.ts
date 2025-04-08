import type { CarType } from '../../../types/CarType';
import type { CarJsonType } from '../../../types/CarJsonType';
import type { WinnerType } from '../../../types/WinnerType';
import carsJson from '../../../components/cars.json';
import Car from '../../../components/Car';
import RaceApi from '../../../api/RaceApi';
import BaseElementCreator from '../../../factory/html/BaseElementCreator';
import InputElementCreator from '../../../factory/html/InputElementCreator';
import Modal from '../../modal/modal';
import Pagination from '../../../components/Pagination';

export default class GarageStateView {
  private container: BaseElementCreator<'div'>;
  private currentPage: number;
  private totalCars: number;
  private readonly api: RaceApi;

  private raceButton!: BaseElementCreator<'button'>;
  private resetButton!: BaseElementCreator<'button'>;
  private generateButton!: BaseElementCreator<'button'>;

  private garageHeader!: BaseElementCreator<'h2'>;
  private carsTable!: BaseElementCreator<'table'>;

  private createForm!: BaseElementCreator<'form'>;
  private createCarName!: BaseElementCreator<'input'>;
  private createCarColor!: BaseElementCreator<'input'>;
  private createButton!: BaseElementCreator<'button'>;

  private updateForm!: BaseElementCreator<'form'>;
  private updateCarName!: BaseElementCreator<'input'>;
  private updateCarColor!: BaseElementCreator<'input'>;
  private updateButton!: BaseElementCreator<'button'>;

  private pagination: Pagination;

  private selectedCarId: number | null;
  private carsArray: Car[];
  private trackWidth: number;
  private isRaceInProgress: boolean;

  constructor() {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper'],
    });
    this.currentPage = 1;
    this.totalCars = 0;
    this.selectedCarId = null;
    this.carsArray = [];
    this.trackWidth = 0;
    this.api = new RaceApi();
    this.isRaceInProgress = false;
    this.pagination = new Pagination({
      currentPage: 1,
      totalItems: this.totalCars,
      itemsPerPage: 7,
      onPageChange: async (newPage: number): Promise<void> => {
        if (this.isRaceInProgress) return;
        this.currentPage = newPage;
        this.garageHeader.setTextContent(`Garage – Page: ${this.currentPage}`);
        await this.refreshGarage();
      },
    });
    window.addEventListener('resize', () => {
      this.updateTrackWidths();
    });
  }

  public async getGarage(): Promise<HTMLElement> {
    const containerElement: HTMLDivElement = this.container.getCreatedElement();
    while (containerElement.firstChild) {
      containerElement.removeChild(containerElement.firstChild);
    }
    this.getTopControls();
    await this.renderGarage();
    return this.container.getCreatedElement();
  }

  private getTopControls(): void {
    this.container.addInnerElement(this.getTopButtons().getCreatedElement());
    this.container.addInnerElement(this.getCreateForm().getCreatedElement());
    this.getUpdateForm();
    this.updateButton.getCreatedElement().addEventListener('click', async (event: Event) => {
      event.preventDefault();
      if (this.selectedCarId === null) {
        new Modal('No car selected for update.');
        return;
      }
      try {
        await this.api.updateCar(
          this.selectedCarId,
          this.updateCarName.getCreatedElement().value,
          this.updateCarColor.getCreatedElement().value,
        );
        this.hideUpdateForm();
        await this.refreshGarage();
      } catch (error) {
        new Modal(`Error while updating car: ${error}`);
      }
    });
    this.hideUpdateForm();
    this.container.addInnerElement(this.updateForm.getCreatedElement());
  }

  private getTopButtons(): BaseElementCreator<'div'> {
    const topButtons: BaseElementCreator<'div'> = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__top'],
    });
    topButtons.addInnerElement(this.getRaceButton().getCreatedElement());
    topButtons.addInnerElement(this.getResetButton().getCreatedElement());
    topButtons.addInnerElement(this.getGenerateButton().getCreatedElement());
    return topButtons;
  }

  private getRaceButton(): BaseElementCreator<'button'> {
    this.raceButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Race',
    });
    this.setEventToRaceButton();
    return this.raceButton;
  }

  private setEventToRaceButton(): void {
    this.raceButton.getCreatedElement().addEventListener('click', async () => {
      if (this.isRaceInProgress) return;
      try {
        this.isRaceInProgress = true;
        this.raceButton.setClassNames(['disabled']);
        this.resetButton.setClassNames(['disabled']);
        this.carsArray.forEach((car: Car) => {
          car.startButton.setClassNames(['disabled']);
          car.stopButton.setClassNames(['disabled']);
        });
        this.pagination.disable();
        let winnerState: { declared: boolean } = { declared: false };
        const carRacePromises: Promise<void>[] = this.getRacePromises(winnerState);
        await Promise.all(carRacePromises);
        this.resetButton.removeClassNames(['disabled']);
      } catch (error) {
        new Modal(`Error while race: ${error}`);
      } finally {
        this.isRaceInProgress = false;
        this.pagination.enable();
      }
    });
  }

  private getRacePromises(haveWinner: { declared: boolean }): Promise<void>[] {
    return this.carsArray.map((car: Car) => this.startCar(car, haveWinner));
  }

  private calculateAnimation(
    carImage: BaseElementCreator<'div'>,
    duration: number,
    raceTrack: BaseElementCreator<'div'>,
  ): void {
    carImage.getCreatedElement().style.setProperty('transition-duration', `${duration}ms`);
    this.trackWidth = raceTrack.getCreatedElement().offsetWidth - carImage.getCreatedElement().offsetWidth;
    carImage.getCreatedElement().style.setProperty('--target-x', `${this.trackWidth}px`);
    carImage.removeClassNames(['broken', 'animate']);
    carImage.setClassNames(['initial']);
    carImage.getCreatedElement().getBoundingClientRect();
    carImage.removeClassNames(['initial']);
    carImage.setClassNames(['animate']);
  }

  private getResetButton(): BaseElementCreator<'button'> {
    this.resetButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Reset',
    });
    this.resetButton.getCreatedElement().addEventListener('click', async () => {
      if (this.isRaceInProgress) return;
      try {
        this.raceButton.removeClassNames(['disabled']);
        await Promise.all(
          this.carsArray.map(async (car: Car) => {
            await this.api.startStopEngine(car.getCarId(), 'stopped');
            car.getCarImageElement().removeClassNames(['broken', 'animate']);
            car.getCarImageElement().setClassNames(['initial']);
            car.startButton.removeClassNames(['disabled']);
            car.stopButton.setClassNames(['disabled']);
          }),
        );
      } catch (error) {
        new Modal(`Error while reset game: ${error}`);
      }
    });
    return this.resetButton;
  }

  private brokeCarOnTrack(elapsed: number, duration: number, carImage: BaseElementCreator<'div'>): void {
    const progress: number = Math.min(1, elapsed / duration);
    carImage.getCreatedElement().dataset.progress = progress.toString();
    carImage.getCreatedElement().style.setProperty('--broken-x', `${progress * this.trackWidth}px`);
    carImage.removeClassNames(['animate']);
    carImage.getCreatedElement().style.removeProperty('--target-x');
    carImage.setClassNames(['broken']);
  }

  private updateTrackWidths(): void {
    this.carsArray.forEach((car: Car) => {
      const raceTrack: BaseElementCreator<'div'> = car.getRaceTrackElement();
      const carImage: BaseElementCreator<'div'> = car.getCarImageElement();
      if (raceTrack && carImage) {
        const newWidth: number = raceTrack.getCreatedElement().offsetWidth - carImage.getCreatedElement().offsetWidth;
        this.trackWidth = newWidth;
        carImage.getCreatedElement().style.setProperty('--target-x', `${newWidth}px`);

        if (carImage.getCreatedElement().classList.contains('broken')) {
          const progressData: string | undefined = carImage.getCreatedElement().dataset.progress;
          const progress: number = progressData ? parseFloat(progressData) : 0;
          carImage.getCreatedElement().style.setProperty('--broken-x', `${progress * newWidth}px`);
        }
      }
    });
  }

  private getGenerateButton(): BaseElementCreator<'button'> {
    this.generateButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Generate Cars',
    });
    this.generateButton.getCreatedElement().addEventListener('click', async (): Promise<void> => {
      if (this.isRaceInProgress) return;
      try {
        const promises: Promise<CarType>[] = [];
        for (let i: number = 0; i < 100; i += 1) {
          const { brand, model }: CarJsonType = carsJson[Math.floor(Math.random() * carsJson.length)];
          const carName: string = `${brand} ${model}`;
          const carColor: string =
            '#' +
            Math.floor(Math.random() * 0xffffff)
              .toString(16)
              .padStart(6, '0');
          promises.push(this.api.createCar(carName, carColor));
        }
        await Promise.all(promises);
        await this.refreshGarage();
      } catch (error: unknown) {
        new Modal(`Error while generating 100 cars: ${error}`);
      }
    });

    return this.generateButton;
  }

  private getCreateForm(): BaseElementCreator<'form'> {
    this.createForm = new BaseElementCreator({
      tagName: 'form',
      classNames: ['main__wrapper-item', 'main__wrapper-item__form', 'main__wrapper-item__form-create'],
    });
    this.createCarName = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-item__form-input'],
      type: 'text',
      placeholder: 'Car name',
    });
    this.createCarColor = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-item__form-input'],
      type: 'color',
      value: '#000000',
    });
    this.createButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Create',
    });
    this.createButton.getCreatedElement().addEventListener('click', async (event: Event) => {
      event.preventDefault();
      if (this.isRaceInProgress) return;
      try {
        await this.api.createCar(
          this.createCarName.getCreatedElement().value,
          this.createCarColor.getCreatedElement().value,
        );
        await this.refreshGarage();
      } catch (error) {
        new Modal(`Error while creating new car: ${error}`);
      }
    });
    this.createForm.addInnerElement(this.createCarName.getCreatedElement());
    this.createForm.addInnerElement(this.createCarColor.getCreatedElement());
    this.createForm.addInnerElement(this.createButton.getCreatedElement());
    return this.createForm;
  }

  private getUpdateForm(): void {
    this.updateForm = new BaseElementCreator({
      tagName: 'form',
      classNames: ['main__wrapper-item', 'main__wrapper-item__form', 'main__wrapper-item__form-update'],
    });
    this.updateCarName = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-item__form-input'],
      type: 'text',
      placeholder: 'Update name',
    });
    this.updateCarColor = new InputElementCreator({
      tagName: 'input',
      classNames: ['main__wrapper-item__form-input'],
      type: 'color',
      value: '#000000',
    });
    this.updateButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Update Car',
    });

    this.updateForm.addInnerElement(this.updateCarName.getCreatedElement());
    this.updateForm.addInnerElement(this.updateCarColor.getCreatedElement());
    this.updateForm.addInnerElement(this.updateButton.getCreatedElement());
  }

  private showUpdateForm(car: CarType): void {
    this.selectedCarId = car.id;
    this.updateCarName.getCreatedElement().value = car.name;
    this.updateCarColor.getCreatedElement().value = car.color;
    this.updateForm.removeClassNames(['hidden']);
  }

  private hideUpdateForm(): void {
    this.updateForm.setClassNames(['hidden']);
  }

  private clearForms(): void {
    this.createCarName.getCreatedElement().value = '';
    this.createCarColor.getCreatedElement().value = '#000000';
    this.updateCarName.getCreatedElement().value = '';
    this.updateCarColor.getCreatedElement().value = '#000000';
    this.selectedCarId = null;
  }

  private async renderGarage(): Promise<HTMLElement> {
    this.carsArray = [];
    this.garageHeader = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: `Garage – Page: ${this.currentPage}`,
    });
    this.container.addInnerElement(this.garageHeader.getCreatedElement());

    await this.getCarsTable();
    this.container.addInnerElement(this.pagination.getElement());
    return this.container.getCreatedElement();
  }

  private async getCarsTable(): Promise<BaseElementCreator<'table'>> {
    try {
      const garage: { cars: CarType[]; totalCount: number } = await this.api.getCars(this.currentPage, 7);
      this.totalCars = garage.totalCount;
      this.carsTable = new BaseElementCreator({
        tagName: 'table',
        classNames: ['main__wrapper-item', 'main__wrapper-item__cars'],
      });
      const carsTableHead: BaseElementCreator<'thead'> = new BaseElementCreator({
        tagName: 'thead',
        classNames: ['cars__counter'],
        textContent: `Total cars: ${this.totalCars}`,
      });
      this.carsTable.addInnerElement(carsTableHead.getCreatedElement());
      const body = new BaseElementCreator({ tagName: 'tbody', classNames: ['cars__wrapper'] });
      await this.createCarsFromData(garage.cars, body);
      this.carsTable.addInnerElement(body.getCreatedElement());
      this.container.addInnerElement(this.carsTable.getCreatedElement());
      this.pagination.updatePageData(this.totalCars, this.currentPage);
    } catch (error) {
      this.container.addInnerElement(
        new BaseElementCreator({
          tagName: 'h2',
          classNames: ['main__wrapper-item'],
          textContent: 'Error while getting cars info from server',
        }).getCreatedElement(),
      );
    }
    return this.carsTable;
  }

  private async createCarsFromData(cars: CarType[], carsTableBody: BaseElementCreator<'tbody'>): Promise<void> {
    cars.forEach((carData: { name: string; color: string; id: number }) => {
      this.createCars(carData, carsTableBody);
    });
  }

  private async createCars(
    carData: { name: string; color: string; id: number },
    carsTableBody: BaseElementCreator<'tbody'>,
  ): Promise<void> {
    const car: Car = new Car(carData.name, carData.color, carData.id);
    this.carsArray.push(car);
    this.addButtonEventListeners(car, carData);
    carsTableBody.addInnerElement(car.getCar());
  }

  private addButtonEventListeners(car: Car, carData: { id: number; name: string; color: string }): void {
    this.addSelectButtonListener(car, carData);
    this.addRemoveButtonListener(car, carData);
    this.addStartButtonListener(car);
    this.addStopButtonListener(car);
  }

  private addSelectButtonListener(car: Car, carData: { id: number; name: string; color: string }): void {
    car.selectButton.getCreatedElement().addEventListener('click', () => {
      if (this.isRaceInProgress) return;
      this.showUpdateForm({ id: carData.id, name: carData.name, color: carData.color });
    });
  }

  private addRemoveButtonListener(car: Car, carData: { id: number }): void {
    car.removeButton.getCreatedElement().addEventListener('click', async () => {
      if (this.isRaceInProgress) return;
      try {
        await this.api.deleteCar(carData.id);
        await this.refreshGarage();
      } catch (error) {
        new Modal(`Error while deleting car: ${error}`);
      }
    });
  }

  private addStartButtonListener(car: Car): void {
    car.startButton.getCreatedElement().addEventListener('click', async () => {
      if (this.isRaceInProgress) return;
      try {
        car.startButton.setClassNames(['disabled']);
        car.stopButton.removeClassNames(['disabled']);
        await this.startCar(car);
      } catch (error) {
        new Modal(`Error while starting car: ${error}`);
      }
    });
  }

  private addStopButtonListener(car: Car): void {
    car.stopButton.getCreatedElement().addEventListener('click', async () => {
      if (this.isRaceInProgress) return;
      try {
        car.startButton.removeClassNames(['disabled']);
        car.stopButton.setClassNames(['disabled']);
        await this.stopCar(car);
        this.raceButton.removeClassNames(['disabled']);
      } catch (error) {
        new Modal(`Error while stopping car: ${error}`);
      }
    });
  }

  private async refreshGarage(): Promise<void> {
    this.clearForms();

    if (this.carsTable && this.carsTable.getCreatedElement().parentElement) {
      this.carsTable.getCreatedElement().remove();
    }
    const paginationElement: HTMLElement = this.pagination.getElement();
    if (paginationElement.parentElement) {
      paginationElement.remove();
    }
    await this.getCarsTable();
    this.container.getCreatedElement().appendChild(this.carsTable.getCreatedElement());
    this.container.getCreatedElement().appendChild(paginationElement);
    this.pagination.updatePageData(this.totalCars, this.currentPage);
  }

  private async startCar(car: Car, haveWinner: { declared: boolean } = { declared: true }): Promise<void> {
    return new Promise<void>((resolve) => {
      this.api
        .startStopEngine(car.getCarId(), 'started')
        .then((engineData: { velocity: number; distance: number }) => {
          const { velocity, distance } = engineData;
          const duration: number = distance / velocity;
          const carImage: BaseElementCreator<'div'> = car.getCarImageElement();
          const raceTrack: BaseElementCreator<'div'> = car.getRaceTrackElement();

          this.calculateAnimation(carImage, duration, raceTrack);

          const startTime: number = Date.now();
          this.api
            .driveEngine(car.getCarId())
            .then(async () => {
              if (!haveWinner.declared) {
                haveWinner.declared = true;
                new Modal(
                  `Won: ${car.getCarName() || 'car without brand'}. Duration: ${Math.ceil(duration / 100) / 10} s. With number: ${car.getCarId()}`,
                );
                await this.handleWinnerResult(car, duration);
              }
              resolve();
            })
            .catch((error) => {
              const elapsed: number = Date.now() - startTime;
              this.brokeCarOnTrack(elapsed, duration, carImage);
              console.error('Something went wrong with engine:', error);
              resolve();
            });
        })
        .catch((error) => {
          console.error('Something went wrong:', error);
          resolve();
        });
    });
  }

  private async handleWinnerResult(car: Car, durationMs: number): Promise<void> {
    const winnerId: number = car.getCarId();
    const durationSec: number = Number((durationMs / 1000).toFixed(2));

    try {
      const existingWinner: WinnerType = await this.api.request<WinnerType>(`/winners/${winnerId}`, {
        method: 'GET',
      });

      await this.api.updateWinner(winnerId, existingWinner.wins + 1, Math.min(existingWinner.time, durationSec));
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        try {
          await this.api.createWinner({ id: winnerId, wins: 1, time: durationSec });
        } catch (createError) {
          console.error('Failed to create winner:', createError);
        }
      } else {
        console.error('Failed to fetch winner info:', error);
      }
    }
  }

  private async stopCar(car: Car): Promise<void> {
    try {
      await this.api.startStopEngine(car.getCarId(), 'stopped');
      const carImage: BaseElementCreator<'div'> = car.getCarImageElement();
      carImage.removeClassNames(['animate', 'broken']);
      carImage.setClassNames(['initial']);
    } catch (error) {
      console.error('Stop car error:', error);
    }
  }
}
