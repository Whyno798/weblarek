import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected _descriptionElement: HTMLElement;
  protected _buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this._buttonElement = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this._buttonElement.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    this._descriptionElement.textContent = `Списано ${value} синапсов`;
  }

  render(data?: Partial<ISuccess>): HTMLElement {
    super.render(data);

    this.total = data?.total ?? 0;

    return this.container;
  }
}
