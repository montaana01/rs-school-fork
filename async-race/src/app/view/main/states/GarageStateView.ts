import type { CarType } from '../../../types/CarType';
import Car from '../../../components/Car';
import RaceApi from '../../../api/RaceApi';
import BaseElementCreator from '../../../factory/html/BaseElementCreator';
import InputElementCreator from '../../../factory/html/InputElementCreator';
import Modal from '../../modal/modal';

export default class GarageStateView {
  private container: BaseElementCreator<'div'>;
  private currentPage: number;
  private totalCars: number;
  private api: RaceApi;

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

  private paginationContainer!: BaseElementCreator<'div'>;

  private selectedCarId: number | null;

  constructor() {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper'],
    });
    this.currentPage = 1;
    this.totalCars = 0;
    this.selectedCarId = null;
    this.api = new RaceApi();
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
    this.raceButton.getCreatedElement().addEventListener('click', async () => {
      try {
        //todo: implement this
        await new Modal('trying to intecact with race button');
      } catch (error) {
        new Modal(`Error while race: ${error}`);
      }
    });
    return this.raceButton;
  }

  private getResetButton(): BaseElementCreator<'button'> {
    this.resetButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Reset',
    });
    this.resetButton.getCreatedElement().addEventListener('click', async () => {
      try {
        //todo: implement this
        await new Modal('trying to intecact with reset button');
      } catch (error) {
        new Modal(`Error while reset game: ${error}`);
      }
    });
    return this.resetButton;
  }

  private getGenerateButton(): BaseElementCreator<'button'> {
    this.generateButton = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__form-button', 'button', 'link'],
      textContent: 'Generate Cars',
    });
    this.generateButton.getCreatedElement().addEventListener('click', async () => {
      try {
        //todo: implement this
        await new Modal('trying to intecact with generate button');
      } catch (error) {
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
    this.garageHeader = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: `Garage – Page: ${this.currentPage}`,
    });
    this.container.addInnerElement(this.garageHeader.getCreatedElement());

    await this.getCarsTable();
    this.renderPagination();
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
      const carsTableBody: BaseElementCreator<'tbody'> = new BaseElementCreator({
        tagName: 'tbody',
        classNames: ['cars__wrapper'],
      });
      await this.createCarsFromData(garage.cars, carsTableBody);
      this.carsTable.addInnerElement(carsTableBody.getCreatedElement());
      this.container.addInnerElement(this.carsTable.getCreatedElement());
    } catch (error) {
      const errorMessage: BaseElementCreator<'h2'> = new BaseElementCreator({
        tagName: 'h2',
        classNames: ['main__wrapper-item'],
        textContent: 'Error while getting cars info from server',
      });
      this.container.addInnerElement(errorMessage.getCreatedElement());
    }
    return this.carsTable;
  }

  private async createCarsFromData(cars: CarType[], carsTableBody: BaseElementCreator<'tbody'>): Promise<void> {
    cars.forEach((carData: { name: string; color: string; id: number }) => {
      const car: Car = new Car(carData.name, carData.color, carData.id);
      car.selectButton.getCreatedElement().addEventListener('click', () => {
        this.showUpdateForm({ id: carData.id, name: carData.name, color: carData.color });
      });
      car.removeButton.getCreatedElement().addEventListener('click', async () => {
        try {
          await this.api.deleteCar(carData.id);
          await this.refreshGarage();
        } catch (error) {
          new Modal(`Error while deleting car: ${error}`);
        }
      });
      carsTableBody.addInnerElement(car.getCar());
    });
  }

  private renderPagination(): void {
    const totalPages: number = Math.ceil(this.totalCars / 7);
    this.paginationContainer = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__pagination'],
    });
    const previousButton: BaseElementCreator<'button'> = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__pagination-item', 'button'],
      textContent: 'Prev',
    });
    const nextButton: BaseElementCreator<'button'> = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__pagination-item', 'button'],
      textContent: 'Next',
    });
    if (this.currentPage === 1) {
      previousButton.setClassNames(['disabled']);
    }
    if (this.currentPage >= totalPages) {
      nextButton.setClassNames(['disabled']);
    }
    previousButton.getCreatedElement().addEventListener('click', async () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.garageHeader.setTextContent(`Garage – Page: ${this.currentPage}`);
        await this.refreshGarage();
      }
    });
    nextButton.getCreatedElement().addEventListener('click', async () => {
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.garageHeader.setTextContent(`Garage – Page: ${this.currentPage}`);
        await this.refreshGarage();
      }
    });
    this.paginationContainer.addInnerElement(previousButton.getCreatedElement());
    this.paginationContainer.addInnerElement(nextButton.getCreatedElement());
    this.container.addInnerElement(this.paginationContainer.getCreatedElement());
  }

  private async refreshGarage(): Promise<void> {
    this.clearForms();
    this.carsTable.getCreatedElement().remove();
    this.paginationContainer.getCreatedElement().remove();
    await this.getCarsTable();
    this.renderPagination();
  }
}
