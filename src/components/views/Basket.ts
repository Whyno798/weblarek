import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _listElement: HTMLElement;
  protected _totalElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this._totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this._buttonElement.addEventListener("click", () => {
      this.events.emit("basket:submit");
    });
  }

  set items(items: HTMLElement[]) {
    this._listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this._totalElement.textContent = `${value} синапсов`;
  }
  set disabled(value: boolean) {
    this._buttonElement.disabled = value;
  }

  render(data?: Partial<IBasketView>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
