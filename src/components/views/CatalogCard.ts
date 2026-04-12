import { ProductCard } from "./ProductCard";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class CatalogCard extends ProductCard {
  constructor(
    container: HTMLElement,
    protected events: IEvents,
    protected onClick: () => void,
  ) {
    super(container, events);

    container.addEventListener("click", () => {
      this.onClick();
    });
  }

  render(product: IProduct): HTMLElement {
    return super.render(product);
  }
}
