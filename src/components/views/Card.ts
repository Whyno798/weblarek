import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Card extends Component<IProduct> {
  protected _titleElement: HTMLElement;
  protected _priceElement: HTMLElement;

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
  }

  set title(value: string) {
    this._titleElement.textContent = value;
  }

  set price(value: number | null) {
    this._priceElement.textContent =
      value === null ? "Бесценно" : `${value} синапсов`;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data?.title !== undefined) this.title = data.title;
    if (data?.price !== undefined) this.price = data.price;
    return super.render(data);
  }
}
