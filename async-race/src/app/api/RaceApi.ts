import type { CarType } from './../types/CarType';

export default class RaceApi {
  private readonly baseApiUrl: string;

  constructor(baseUrl: string = 'http://127.0.0.1:3000') {
    this.baseApiUrl = baseUrl;
  }

  public async getCars(page: number = 1, limit: number = 7): Promise<{ cars: CarType[]; totalCount: number }> {
    const response: Response = await fetch(`${this.baseApiUrl}/garage?_page=${page}&_limit=${limit}`);
    const totalHeader: string | null = response.headers.get('X-Total-Count');
    const carsCount: number = totalHeader ? Number(totalHeader) : 0;
    const cars: CarType[] = await response.json();
    return { cars, totalCount: carsCount };
  }

  public async getCar(id: number): Promise<CarType> {
    return this.request<CarType>(`/garage/${id}`);
  }

  public async createCar(name: string, color: string): Promise<CarType> {
    return this.request<CarType>('/garage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
  }

  public async updateCar(id: number, name: string, color: string): Promise<CarType> {
    return this.request<CarType>(`/garage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
  }

  public async deleteCar(id: number): Promise<{}> {
    return this.request<{}>(`/garage/${id}`, { method: 'DELETE' });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response: Response = await fetch(`${this.baseApiUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Ошибка запроса ${endpoint}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
