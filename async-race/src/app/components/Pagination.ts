import BaseElementCreator from '../factory/html/BaseElementCreator';
import type { PaginationType } from '../types/PaginationType.ts';

export default class Pagination {
  private container: BaseElementCreator<'div'>;
  private currentPage: number;
  private totalItems: number;
  private readonly itemsPerPage: number;
  private readonly onPageChange: (newPage: number) => void;
  private isDisabled: boolean;

  private previousButton!: BaseElementCreator<'button'>;
  private nextButton!: BaseElementCreator<'button'>;

  constructor({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationType) {
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.onPageChange = onPageChange;
    this.container = new BaseElementCreator({
      tagName: 'div',
      classNames: ['main__wrapper-item', 'main__wrapper-item__pagination'],
    });
    this.isDisabled = false;

    this.render();
  }

  public getElement(): HTMLElement {
    return this.container.getCreatedElement();
  }

  public updatePageData(totalItems: number, currentPage: number): void {
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.update();
  }

  public disable(): void {
    this.isDisabled = true;
    this.previousButton.setClassNames(['disabled']);
    this.nextButton.setClassNames(['disabled']);
  }

  public enable(): void {
    this.isDisabled = false;
    this.previousButton.removeClassNames(['disabled']);
    this.nextButton.removeClassNames(['disabled']);
  }

  private render(): void {
    const totalPages: number = Math.ceil(this.totalItems / this.itemsPerPage);
    this.container.removeInnerElements();

    this.previousButton = this.createPaginationButton(
      'Prev',
      this.currentPage - 1,
      this.currentPage === 1 || this.isDisabled,
    );
    this.nextButton = this.createPaginationButton(
      'Next',
      this.currentPage + 1,
      this.currentPage >= totalPages || this.isDisabled,
    );

    this.container.addInnerElement(this.previousButton.getCreatedElement());
    this.container.addInnerElement(this.nextButton.getCreatedElement());
  }

  private createPaginationButton(
    label: 'Prev' | 'Next',
    targetPage: number,
    isDisabled: boolean,
  ): BaseElementCreator<'button'> {
    const button: BaseElementCreator<'button'> = new BaseElementCreator({
      tagName: 'button',
      classNames: ['main__wrapper-item__pagination-item', 'button'],
      textContent: label,
    });

    if (isDisabled) {
      button.getCreatedElement().classList.add('disabled');
    }

    button.getCreatedElement().addEventListener('click', () => {
      if (isDisabled || targetPage === this.currentPage) return;
      this.currentPage = targetPage;
      this.onPageChange(this.currentPage);
      this.update();
    });

    return button;
  }

  private update(): void {
    this.render();
  }
}
