import { Card } from "./Card";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogCard extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this._id });
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);
    return this.container;
  }
}
