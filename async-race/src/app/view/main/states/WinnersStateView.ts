import Car from '../../../components/Car.ts';

export default class WinnersStateView {
  private car: Car;
  constructor() {
    this.car = new Car('winners', 'winners-test-color', 1);
  }
  public getWinners(): HTMLElement {
    return this.car.getCar();
  }
}
