import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IHeaderData {
  counter: number;
}

export class Header extends Component<IHeaderData> {
  protected _basketButton: HTMLButtonElement;
  protected _counterElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );
    this._counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );

    this._basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this._counterElement.textContent = value.toString();

    if (value > 0) {
      this._counterElement.classList.remove("hidden");
    } else {
      this._counterElement.classList.add("hidden");
    }
  }

  render(data?: Partial<IHeaderData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
