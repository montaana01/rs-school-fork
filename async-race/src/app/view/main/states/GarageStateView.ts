import Car from '../../../components/Car';
import RaceApi from '../../../api/RaceApi';
import BaseElementCreator from '../../../factory/html/BaseElementCreator';
import type { CarType } from '../../../types/CarType.ts';

export default class GarageStateView {
  private container: BaseElementCreator<'div'>;
  private currentPage: number;
  private totalCars: number;
  private api: RaceApi;

  constructor() {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper'],
    });
    this.currentPage = 1;
    this.totalCars = 0;
    this.api = new RaceApi();
  }

  public async getGarage(): Promise<HTMLElement> {
    await this.renderGarage();
    return this.container.getCreatedElement();
  }

  public async renderGarage(): Promise<HTMLElement> {
    while (this.container.getCreatedElement().firstChild) {
      this.container.getCreatedElement().removeChild(this.container.getCreatedElement());
    }

    const garageHeader: BaseElementCreator<'h2'> = new BaseElementCreator({
      tagName: 'h2',
      classNames: ['main__wrapper-item', 'main__wrapper-item__title'],
      textContent: `Garage – Page: ${this.currentPage}`,
    });
    this.container.addInnerElement(garageHeader.getCreatedElement());

    try {
      const garage: { cars: CarType[]; totalCount: number } = await this.api.getCars(this.currentPage, 7);
      this.totalCars = garage.totalCount;

      const carsTable: BaseElementCreator<'table'> = this.getCarsTable(garage.cars);
      this.container.addInnerElement(carsTable.getCreatedElement());
    } catch (error) {
      const errorMessage: BaseElementCreator<'h2'> = new BaseElementCreator({
        tagName: 'h2',
        classNames: ['main__wrapper-item'],
        textContent: 'Error while getting cars info from server',
      });
      this.container.addInnerElement(errorMessage.getCreatedElement());
    }
    return this.container.getCreatedElement();
  }

  private getCarsTable(cars: CarType[]): BaseElementCreator<'table'> {
    const carsTable: BaseElementCreator<'table'> = new BaseElementCreator({
      tagName: 'table',
      classNames: ['main__wrapper-item', 'main__wrapper-item__cars'],
    });

    const carsTableHead: BaseElementCreator<'thead'> = new BaseElementCreator({
      tagName: 'thead',
      classNames: ['cars__counter'],
      textContent: `Total cars: ${this.totalCars}`,
    });
    carsTable.addInnerElement(carsTableHead.getCreatedElement());

    const carsTableBody: BaseElementCreator<'tbody'> = new BaseElementCreator({
      tagName: 'tbody',
      classNames: ['cars__wrapper'],
    });

    cars.forEach((carData: { name: string; color: string; id: number }) => {
      const car: Car = new Car(carData.name, carData.color, carData.id);
      carsTableBody.addInnerElement(car.getCar());
    });

    carsTable.addInnerElement(carsTableBody.getCreatedElement());

    return carsTable;
  }
}
