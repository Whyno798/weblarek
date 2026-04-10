import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  constructor(protected events: IEvents) {}

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("order:changed", this.getData());
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("contacts:changed", this.getData());
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("contacts:changed", this.getData());
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("order:changed", this.getData());
  }

  getData(): Partial<IBuyer> {
    return {
      payment: this.payment!,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";

    this.events.emit("order:changed", this.getData());
    this.events.emit("contacts:changed", this.getData());
  }

  validate(): Record<string, string> | null {
    const errors: Record<string, string> = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.address.trim()) {
      errors.address = "Укажите адрес";
    }

    if (!this.email.trim()) {
      errors.email = "Укажите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = "Некорректный email";
    }

    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    } else if (!/^\+?\d[\d\s\-()]{9,}$/.test(this.phone)) {
      errors.phone = "Некорректный телефон";
    }

    return Object.keys(errors).length ? errors : null;
  }
}
