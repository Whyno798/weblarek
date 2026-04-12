import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

export class BasketCard extends Card {
  protected _indexElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    protected removeCallBack: () => void,
  ) {
    super(container, events);

    this._indexElement = ensureElement(".basket__item-index", container);
    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this._buttonElement.addEventListener("click", () => {
      this.removeCallBack();
    });
  }

  set index(value: number) {
    this._indexElement.textContent = String(value);
  }

  render(product: IProduct): HTMLElement {
    return super.render(product);
  }
}
