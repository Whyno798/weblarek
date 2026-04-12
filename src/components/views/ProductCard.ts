import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export class ProductCard extends Card {
  protected imageElement!: HTMLImageElement;
  protected categoryElement!: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement(".card__category", container);
  }

  setImage(element: HTMLImageElement, src: string): void {
    element.src = src;
    element.alt = "";
  }

  set category(value: string) {
    if (!this.categoryElement) {
      return;
    }

    this.categoryElement.className = "card__category";
    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }

    this.categoryElement.textContent = value;
  }

  render(data?: Partial<IProduct>): HTMLElement {
    if (data?.image !== undefined) {
      this.setImage(this.imageElement, data.image);
    }

    if (data?.category !== undefined) {
      this.category = data.category;
    }

    return super.render(data);
  }
}
