import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class CatalogCard extends ProductCard {
  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);

    container.addEventListener("click", () => {
      const id = container.dataset.id;
      if (id) {
        this.events.emit("card:select", { id });
      }
    });
  }

  render(product: IProduct): HTMLElement {
    this.container.dataset.id = product.id;
    return super.render(product);
  }
}
