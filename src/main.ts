import "./scss/styles.scss";

import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";

import { Catalog } from "./components/Models/Catalog";
import { Cart } from "./components/Models/Cart";
import { Buyer } from "./components/Models/Buyer";
import { ApiService } from "./components/Comunication/ApiService";

import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { Modal } from "./components/views/Modal";
import { CatalogCard } from "./components/views/CatalogCard";
import { PreviewCard } from "./components/views/PreviewCard";
import { Basket } from "./components/views/Basket";
import { BasketCard } from "./components/views/BasketCard";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";

import { cloneTemplate, ensureElement } from "./utils/utils";
import { API_URL } from "./utils/constants";
import { IProduct, TPayment } from "./types";

// --------------------
// Базовые экземпляры
// --------------------

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalog = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// --------------------
// View
// --------------------

const header = new Header(ensureElement<HTMLElement>(".header"), events);

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

const basket = new Basket(cloneTemplate<HTMLElement>("#basket"), events);

const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>("#order"),
  events,
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);

// --------------------
// Вспомогательные функции
// --------------------

function renderBasket(): void {
  header.counter = cart.getItemCount();

  const basketItems = cart.getItems().map((product, index) => {
    const basketCard = new BasketCard(
      cloneTemplate<HTMLElement>("#card-basket"),
      events,
    );

    basketCard.index = index + 1;

    return basketCard.render(product);
  });

  basket.items = basketItems;
  basket.total = cart.getTotalPrice();
  basket.disabled = cart.getItemCount() === 0;
}

function validateBuyer(): void {
  const errors = buyer.validate();

  const errorText = errors
    ? Object.values(errors).filter(Boolean).join("; ")
    : "";

  const orderValid = !errors?.payment && !errors?.address;
  const contactsValid = !errors?.email && !errors?.phone;

  orderForm.valid = orderValid;
  orderForm.errors = errorText;

  contactsForm.valid = contactsValid;
  contactsForm.errors = errorText;
}

function getOrderData() {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  if (
    errors ||
    !buyerData.payment ||
    !buyerData.email ||
    !buyerData.phone ||
    !buyerData.address
  ) {
    return null;
  }

  return {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: cart.getItems().map((item) => item.id),
    total: cart.getTotalPrice(),
  };
}

// --------------------
// События каталога
// --------------------

events.on("catalog:changed", () => {
  const cards = catalog.getProducts().map((product: IProduct) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>("#card-catalog"),
      events,
    );

    return card.render(product);
  });

  gallery.render({ items: cards });
});

events.on("card:select", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);

  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on("preview:changed", () => {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  const previewCard = new PreviewCard(cloneTemplate("#card-preview"), events);

  const isInBasket = cart.hasItem(product.id);
  const isUnavailable = product.price === null;

  previewCard.inBasket = isInBasket;
  previewCard.disabled = isUnavailable;

  if (isUnavailable) {
    previewCard.buttonText = "Недоступно";
  }

  const previewContent = previewCard.render(product);

  modal.content = previewContent;
  modal.open();
});

// --------------------
// События корзины
// --------------------

events.on("card:add", () => {
  const product = catalog.getSelectedProduct();

  if (!product || product.price === null) {
    return;
  }

  cart.addItem(product);
  modal.close();
});

events.on("basket:changed", () => {
  renderBasket();
});

events.on("basket:open", () => {
  renderBasket();
  modal.content = basket.render();
  modal.open();
});

events.on("basket:remove", (data: { id: string }) => {
  const product = cart.getItems().find((item) => item.id === data.id);

  if (product) {
    cart.removeItem(product);
    modal.close();
  }
});

events.on("basket:submit", () => {
  const buyerData = buyer.getData();

  validateBuyer();
  modal.content = orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address ?? "",
  });
  modal.open();
});

events.on("order:submit", () => {
  const buyerData = buyer.getData();

  validateBuyer();
  modal.content = contactsForm.render({
    email: buyerData.email ?? "",
    phone: buyerData.phone ?? "",
  });
  modal.open();
});

// --------------------
// События формы заказа
// --------------------

events.on(
  "order.payment:change",
  (data: { field: string; value: TPayment }) => {
    buyer.setPayment(data.value);
    orderForm.payment = data.value;
    validateBuyer();
  },
);

events.on("order.address:change", (data: { field: string; value: string }) => {
  buyer.setAddress(data.value);
  validateBuyer();
});

events.on("contacts.email:change", (data: { field: string; value: string }) => {
  buyer.setEmail(data.value);
  validateBuyer();
});

events.on("contacts.phone:change", (data: { field: string; value: string }) => {
  buyer.setPhone(data.value);
  validateBuyer();
});

events.on("contacts:submit", async () => {
  const orderData = getOrderData();

  if (!orderData) {
    validateBuyer();
    return;
  }

  try {
    const result = await apiService.createOrder(orderData);

    cart.clear();
    buyer.clear();
    header.counter = 0;
    renderBasket();

    const success = new Success(cloneTemplate("#success"), events);

    modal.content = success.render({ total: result.total });
    modal.open();
  } catch (error) {
    console.error(error);
  }
});

// --------------------
// Экран успеха
// --------------------

events.on("success:close", () => {
  modal.close();
});

// --------------------
// Загрузка данных
// --------------------

apiService
  .getProducts()
  .then((result) => {
    const products = Array.isArray(result) ? result : result.items;
    catalog.saveProducts(products);
  })
  .catch((error) => {
    console.error(error);
  });

events.on("catalog:changed", () => {
  const cards = catalog.getProducts().map((product: IProduct) => {
    console.log(product);
    const card = new CatalogCard(cloneTemplate("#card-catalog"), events);

    return card.render(product);
  });

  gallery.render({ items: cards });
});
