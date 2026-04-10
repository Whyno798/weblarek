import { Card } from "./Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class PreviewCard extends Card {
  protected _descriptionElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;
  protected _inBasket = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this._buttonElement.addEventListener("click", () => {
      if (this._inBasket) {
        this.events.emit("basket:remove", { id: this._id });
      } else {
        this.events.emit("card:add", { id: this._id });
      }
    });
  }

  set description(value: string) {
    this._descriptionElement.textContent = value;
  }

  set disabled(value: boolean) {
    this._buttonElement.disabled = value;
  }

  set buttonText(value: string) {
    this._buttonElement.textContent = value;
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    this.buttonText = value ? "Удалить из корзины" : "В корзину";
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
