import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { ProductCard } from "./ProductCard";
import { IProduct } from "../../types";

export class PreviewCard extends ProductCard {
  protected _descriptionElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._descriptionElement = ensureElement(".card__text", container);
    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this._buttonElement.addEventListener("click", () => {
      events.emit("card:add");
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

  render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    return super.render(product);
  }
}
