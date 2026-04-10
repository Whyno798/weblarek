import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this._contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this._closeButton.addEventListener("click", this.close);
    this.container.addEventListener("click", (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this._contentElement.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close = () => {
    this.container.classList.remove("modal_active");
    this.content = document.createElement("div");
    this.events.emit("modal:close");
  };

  render(data?: Partial<IModalData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
