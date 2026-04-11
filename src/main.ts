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
import { API_URL, CDN_URL } from "./utils/constants";
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
const header = new Header(ensureElement(".header"), events);

const gallery = new Gallery(ensureElement(".gallery"));

const modal = new Modal(ensureElement("#modal-container"), events);

const basket = new Basket(cloneTemplate("#basket"), events);
basket.disabled = true;

const previewCard = new PreviewCard(cloneTemplate("#card-preview"), events);
const orderForm = new OrderForm(cloneTemplate("#order"), events);
const contactsForm = new ContactsForm(cloneTemplate("#contacts"), events);
const success = new Success(cloneTemplate("#success"), events);

// --------------------
// Обработчики моделей
// --------------------
events.on("order:changed", validateOrderForm);
events.on("contacts:changed", validateContactsForm);
events.on("basket:changed", () => {
  renderBasket();
  updatePreviewState();
});
events.on("preview:changed", renderPreview);

// --------------------
// Вспомогательные функции
// --------------------
function renderBasket(): void {
  const items = cart.getItems();
  const count = items.length;
  const total = cart.getTotalPrice();

  header.counter = count;

  const basketItems = items.map((product, index) => {
    const basketCard = new BasketCard(
      cloneTemplate("#card-basket"),
      events,
      (id: string) => events.emit("basket:remove", { id }),
    );

    basketCard.index = index + 1;
    return basketCard.render(product);
  });

  basket.items = basketItems;
  basket.total = total;
  basket.disabled = count === 0;
}

function validateOrderForm(): void {
  const errors = buyer.validate();
  const orderErrors = [errors?.payment, errors?.address]
    .filter(Boolean)
    .join("; ");

  orderForm.errors = orderErrors;
  orderForm.valid = !errors?.payment && !errors?.address;
}

function validateContactsForm(): void {
  const errors = buyer.validate();
  const contactsErrors = [errors?.email, errors?.phone]
    .filter(Boolean)
    .join("; ");

  contactsForm.errors = contactsErrors;
  contactsForm.valid = !errors?.email && !errors?.phone;
}

function updatePreviewState(): void {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  const isUnavailable = product.price === null;
  const isInBasket = cart.hasItem(product.id);

  previewCard.disabled = isUnavailable || isInBasket;

  if (isUnavailable) {
    previewCard.buttonText = "Недоступно";
  } else if (isInBasket) {
    previewCard.buttonText = "Уже в корзине";
  } else {
    previewCard.buttonText = "В корзину";
  }
}

function renderPreview(): void {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  previewCard.title = product.title;
  previewCard.category = product.category;
  previewCard.price = product.price;
  previewCard.description = product.description;

  updatePreviewState();

  modal.content = previewCard.render({
    ...product,
    image: `${CDN_URL}${product.image}`,
  });

  modal.open();
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
    const card = new CatalogCard(cloneTemplate("#card-catalog"), events);
    card.title = product.title;
    card.category = product.category;
    card.price = product.price;

    return card.render({
      ...product,
      image: `${CDN_URL}${product.image}`,
    });
  });

  gallery.items = cards;
});

events.on("card:select", (data: { id: string }) => {
  const product = catalog.getProductById(data.id);

  if (product) {
    catalog.setSelectedProduct(product);
  }
});

// --------------------
// События корзины
// --------------------
events.on("card:add", () => {
  const product = catalog.getSelectedProduct();

  if (!product || product.price === null || cart.hasItem(product.id)) {
    return;
  }

  cart.addItem(product);
});

events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

events.on("basket:remove", (data: { id: string }) => {
  cart.removeItem(data.id);
});

events.on("basket:submit", () => {
  validateOrderForm();
  modal.content = orderForm.render(buyer.getData());
  modal.open();
});

events.on("order:submit", () => {
  validateContactsForm();
  modal.content = contactsForm.render(buyer.getData());
  modal.open();
});

// --------------------
// События формы заказа
// --------------------
events.on(
  "order.payment:change",
  (data: { field: string; value: TPayment }) => {
    buyer.setPayment(data.value);
  },
);

events.on("order.address:change", (data: { field: string; value: string }) => {
  buyer.setAddress(data.value);
});

events.on("contacts.email:change", (data: { field: string; value: string }) => {
  buyer.setEmail(data.value);
});

events.on("contacts.phone:change", (data: { field: string; value: string }) => {
  buyer.setPhone(data.value);
});

events.on("contacts:submit", async () => {
  const orderData = getOrderData();

  if (!orderData) {
    return;
  }

  try {
    const result = await apiService.createOrder(orderData);

    cart.clear();
    buyer.clear();

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
