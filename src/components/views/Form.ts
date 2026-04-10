import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Form<T> extends Component<T> {
  protected _submitButton: HTMLButtonElement;
  protected _errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this._submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this._errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", this.onSubmit);

    this.container.addEventListener("input", (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      this.onInputChange(target.name, target.value);
    });
  }

  protected onInputChange(field: string, value: string) {
    this.events.emit(
      `${(this.container as HTMLFormElement).name}.${field}:change`,
      {
        field,
        value,
      },
    );
  }

  protected onSubmit = (evt: Event) => {
    evt.preventDefault();
    this.events.emit(`${(this.container as HTMLFormElement).name}:submit`);
  };

  set valid(value: boolean) {
    this._submitButton.disabled = !value;
  }

  set errors(value: string) {
    this._errorsElement.textContent = value;
  }

  render(state?: Partial<T>): HTMLElement {
    super.render(state);
    return this.container;
  }
}
