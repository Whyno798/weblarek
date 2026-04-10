import { Card } from "./Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class BasketCard extends Card {
  protected _indexElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this._buttonElement.addEventListener("click", () => {
      this.events.emit("basket:remove", { id: this._id });
    });
  }

  set index(value: number) {
    this._indexElement.textContent = String(value);
  }

  render(data?: Partial<IProduct> & { index?: number }): HTMLElement {
    super.render(data);
    if (typeof data?.index === "number") {
      this.index = data.index;
    }
    return this.container;
  }
}
