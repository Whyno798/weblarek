import { Form } from "./Form";
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";
import { ensureAllElements, ensureElement } from "../../utils/utils";

export class OrderForm extends Form<IBuyer> {
  protected _buttons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons .button",
      this.container,
    );

    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this._buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.name as TPayment;
        this.payment = value;
        this.events.emit("order.payment:change", {
          field: "payment",
          value,
        });
      });
    });
  }

  set payment(value: TPayment) {
    this._buttons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  render(data?: Partial<IBuyer>): HTMLElement {
    if (data?.payment) {
      this.payment = data.payment;
    }

    if (data?.address !== undefined) {
      this.address = data.address;
    }

    return super.render(data);
  }
}
