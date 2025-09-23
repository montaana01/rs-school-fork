import type { CarType } from './../types/CarType';
import type { WinnerType } from '../types/WinnerType.ts';

type EngineStatus = 'started' | 'stopped' | 'drive';
export type SortField = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

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

  public async deleteCar(id: number): Promise<void> {
    await this.request(`/garage/${id}`, { method: 'DELETE' });
    try {
      await this.request(`/winners/${id}`, { method: 'DELETE' });
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
    }
  }

  public async startStopEngine(id: number, status: EngineStatus): Promise<{ velocity: number; distance: number }> {
    return this.request(`/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
  }

  public async driveEngine(id: number): Promise<{ success: boolean }> {
    return this.request(`/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });
  }

  public async getWinners(
    page: number = 1,
    limit: number = 10,
    sort: 'id' | 'wins' | 'time' = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ winners: WinnerType[]; totalCount: number }> {
    const response: Response = await fetch(
      `${this.baseApiUrl}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
    );
    const totalHeader: string | null = response.headers.get('X-Total-Count');
    const totalCount: number = totalHeader ? Number(totalHeader) : 0;
    const winners = await response.json();
    return { winners, totalCount };
  }

  public async getWinner(id: number): Promise<WinnerType> {
    return this.request<WinnerType>(`/winners/${id}`);
  }

  public async createWinner(winner: WinnerType): Promise<WinnerType> {
    return this.request<WinnerType>('/winners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  }

  public async updateWinner(id: number, wins: number, time: number): Promise<WinnerType> {
    return this.request<WinnerType>(`/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wins, time }),
    });
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response: Response = await fetch(`${this.baseApiUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Request error${endpoint}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
