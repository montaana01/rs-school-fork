import type { WinnerType } from '../../../types/WinnerType';
import type { SortField, SortOrder } from '../../../api/RaceApi';
import RaceApi from '../../../api/RaceApi';
import BaseElementCreator from '../../../factory/html/BaseElementCreator';
import Pagination from '../../../components/Pagination.ts';
import type { CarType } from '../../../types/CarType.ts';

export default class WinnersStateView {
  private container: BaseElementCreator<'div'>;
  private currentPage: number;
  private totalWinners: number;
  private sortField: SortField;
  private sortOrder: SortOrder;
  private readonly api: RaceApi;
  private header!: BaseElementCreator<'h2'>;
  private pagination: Pagination;
  private readonly mainWrapperItemClass: string;

  constructor() {
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper'],
    });
    this.currentPage = 1;
    this.totalWinners = 0;
    this.sortField = 'wins';
    this.sortOrder = 'ASC';
    this.mainWrapperItemClass = 'main__wrapper-item';
    this.api = new RaceApi();
    this.pagination = new Pagination({
      currentPage: 1,
      totalItems: this.totalWinners,
      itemsPerPage: 10,
      onPageChange: async (newPage: number): Promise<void> => {
        this.currentPage = newPage;
        this.header.setTextContent(`Winners – Page: ${this.currentPage}`);
        await this.renderWinners();
      },
    });
  }

  public async getWinners(): Promise<HTMLElement> {
    return await this.renderWinners();
  }

  private async renderWinners(): Promise<HTMLElement> {
    this.container.removeInnerElements();

    this.renderHeader();
    await this.renderWinnersTable();
    this.container.addInnerElement(this.pagination.getElement());

    return this.container.getCreatedElement();
  }

  private renderHeader(): void {
    this.header = new BaseElementCreator({
      tagName: 'h2',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__title'],
      textContent: `Winners – Page: ${this.currentPage}`,
    });
    this.container.addInnerElement(this.header.getCreatedElement());
  }

  private async renderWinnersTable(): Promise<void> {
    let root: HTMLDivElement = this.container.getCreatedElement();
    try {
      const { winners, totalCount } = await this.api.getWinners(this.currentPage, 10, this.sortField, this.sortOrder);
      this.totalWinners = totalCount;
      this.pagination.updatePageData(this.totalWinners, this.currentPage);

      const table: BaseElementCreator<'table'> = this.createTable();
      const tbody: BaseElementCreator<'tbody'> = await this.createTableBody(winners);

      table.addInnerElement(tbody.getCreatedElement());
      this.container.addInnerElement(table.getCreatedElement());
    } catch (error) {
      console.error('Error loading winners:', error);
      const errorElement: BaseElementCreator<'p'> = new BaseElementCreator({
        tagName: 'p',
        classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-error'],
        textContent: 'Error loading winners data.',
      });
      root.appendChild(errorElement.getCreatedElement());
    }
  }

  private createTable(): BaseElementCreator<'table'> {
    const table: BaseElementCreator<'table'> = new BaseElementCreator({
      tagName: 'table',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table'],
    });
    const thead: HTMLElement = this.createTableHeader();
    table.addInnerElement(thead);
    return table;
  }

  private async createTableBody(winners: WinnerType[]): Promise<BaseElementCreator<'tbody'>> {
    const tbody: BaseElementCreator<'tbody'> = new BaseElementCreator({
      tagName: 'tbody',
      classNames: ['main__wrapper-item__table', 'main__wrapper-item__table-tbody'],
    });

    const rows: HTMLElement[] = await Promise.all(
      winners.map((winner: WinnerType, index: number) => this.renderWinnerRow(winner, index)),
    );

    rows.forEach((row: HTMLElement) => tbody.addInnerElement(row));
    return tbody;
  }

  private createTableHeader(): HTMLElement {
    const thead: BaseElementCreator<'thead'> = new BaseElementCreator({
      tagName: 'thead',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-thead'],
    });
    const headRow: BaseElementCreator<'tr'> = new BaseElementCreator({
      tagName: 'tr',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-tr'],
    });
    const columns: string[] = ['№', 'Car Image', 'Name', 'Wins', 'Best Time'];
    columns.forEach((col: string, index: number) => {
      const th: BaseElementCreator<'th'> = new BaseElementCreator({
        tagName: 'th',
        classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-th'],
        textContent: col,
      });
      if (index === 3 || index === 4) {
        th.getCreatedElement().style.cursor = 'pointer';
        th.getCreatedElement().onclick = async (): Promise<void> => {
          const field: SortField = index === 3 ? 'wins' : 'time';
          if (this.sortField === field) {
            this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
          } else {
            this.sortField = field;
            this.sortOrder = 'ASC';
          }
          await this.renderWinners();
        };
      }
      headRow.addInnerElement(th.getCreatedElement());
    });
    thead.addInnerElement(headRow.getCreatedElement());
    return thead.getCreatedElement();
  }

  private async renderWinnerRow(winner: WinnerType, index: number): Promise<HTMLElement> {
    try {
      const car: CarType = await this.api.getCar(winner.id);
      const row: BaseElementCreator<'tr'> = this.createRow();

      const numberCell: BaseElementCreator<'td'> = this.createCell(`${(this.currentPage - 1) * 10 + index + 1}`);
      const imageCell: BaseElementCreator<'td'> = this.createImageCell(car.color);
      const nameCell: BaseElementCreator<'td'> = this.createCell(car.name);
      const winsCell: BaseElementCreator<'td'> = this.createCell(`${winner.wins}`);
      const timeCell: BaseElementCreator<'td'> = this.createCell(winner.time.toFixed(2));

      [numberCell, imageCell, nameCell, winsCell, timeCell].forEach((cell) =>
        row.addInnerElement(cell.getCreatedElement()),
      );

      return row.getCreatedElement();
    } catch (error) {
      console.error(`Failed to fetch car data for winner with id ${winner.id}:`, error);
      const fallback: BaseElementCreator<'tr'> = new BaseElementCreator({
        tagName: 'tr',
        classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-tr'],
        textContent: `Error loading winner data for ID ${winner.id}`,
      });
      return fallback.getCreatedElement();
    }
  }

  private createRow(): BaseElementCreator<'tr'> {
    return new BaseElementCreator({
      tagName: 'tr',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-tr'],
    });
  }

  private createCell(content: string): BaseElementCreator<'td'> {
    return new BaseElementCreator({
      tagName: 'td',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-td'],
      textContent: content,
    });
  }

  private createImageCell(color: string): BaseElementCreator<'td'> {
    const imageCell: BaseElementCreator<'td'> = this.createCell('');
    const image: BaseElementCreator<'img'> = new BaseElementCreator({
      tagName: 'img',
      classNames: [this.mainWrapperItemClass, 'main__wrapper-item__table-img'],
    });
    image.getCreatedElement().src = color;
    image.getCreatedElement().alt = 'Car Image';
    imageCell.addInnerElement(image.getCreatedElement());
    return imageCell;
  }
}
