import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed', { items: this.items });
  }

  removeItem(product: IProduct): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    this.events.emit('basket:changed', { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', { items: this.items });
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
