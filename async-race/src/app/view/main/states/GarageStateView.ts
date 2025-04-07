import Car from '../../../components/Car.ts';

export default class GarageStateView {
  private car: Car;
  constructor() {
    this.car = new Car('garage', 'garage-test-color', 1);
  }
  public getGarage(): HTMLElement {
    return this.car.getCar();
  }
}
