import Car from '../../../components/Car.ts';

export default class WinnersStateView {
  private car: Car;
  constructor() {
    this.car = new Car('winners', 'winners-test-color', 1);
  }
  public async getWinners(): Promise<HTMLElement> {
    return this.car.getCar();
  }
}
