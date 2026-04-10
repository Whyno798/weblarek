import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class Card extends Component<IProduct> {
  protected _titleElement: HTMLElement;
  protected _priceElement: HTMLElement;
  protected _categoryElement?: HTMLElement;
  protected _imageElement?: HTMLImageElement;
  protected _id!: string;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this._priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
    this._categoryElement = this.container.querySelector(
      ".card__category",
    ) as HTMLElement;
    this._imageElement = this.container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
  }

  set id(value: string) {
    this._id = value;
  }

  get id() {
    return this._id;
  }

  set title(value: string) {
    this._titleElement.textContent = value;
  }

  set price(value: number | null) {
    this._priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }

  set category(value: string) {
    if (!this._categoryElement) {
      return;
    }

    this._categoryElement.className = "card__category";
    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this._categoryElement.classList.add(categoryClass);
    }

    this._categoryElement.textContent = value;
  }

  set image(value: string) {
    if (this._imageElement) {
      this._imageElement.src = `${CDN_URL}${value}`;
      this._imageElement.alt = this.title || "";
    }
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
