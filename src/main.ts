import "./scss/styles.scss";

// src/main.ts (добавить в конец файла, после существующего кода)

// Импорты для тестирования моделей
import { Catalog } from "./components/Models/Catalog.js";
import { Cart } from "./components/Models/Cart.js";
import { Buyer } from "./components/Models/Buyer.js";
import { apiProducts } from "./utils/data.js"; // тестовые данные товаров

// Создание экземпляров моделей
console.log("=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===");

const catalog = new Catalog();
const cart = new Cart();
const buyer = new Buyer();

// 1. Тестирование Catalog
console.log("\n1. Catalog (Каталог товаров):");
catalog.saveProducts(apiProducts.items);
console.log("Массив товаров из каталога:", catalog.getProducts());

const firstProduct = catalog.getProducts()[0];
console.log("Первый товар по ID:", catalog.getProductById(firstProduct.id));

catalog.setSelectedProduct(firstProduct);
console.log("Выбранный товар:", catalog.getSelectedProduct());

// 2. Тестирование Cart
console.log("\n2. Cart (Корзина):");
console.log("Корзина изначально пуста:", cart.getItems());

cart.addItem(firstProduct);
console.log("После добавления товара:", cart.getItems());
console.log("Количество товаров в корзине:", cart.getItemCount());
console.log("Общая стоимость:", cart.getTotalPrice());
console.log("Товар в корзине?", cart.hasItem(firstProduct.id));

cart.removeItem(firstProduct);
console.log("После удаления товара:", cart.getItems());
console.log("Корзина пуста?", cart.getItemCount() === 0);

cart.clear();
console.log("После очистки корзины:", cart.getItems());

// 3. Тестирование Buyer
console.log("\n3. Buyer (Покупатель):");
buyer.setEmail("test@example.com");
buyer.setPhone("+79991234567");
buyer.setAddress("Москва, ул. Тестовая, 1");

console.log("Данные покупателя:", buyer.getData());

const validationErrors = buyer.validate();
console.log("Ошибки валидации:", validationErrors); // должно быть null

buyer.clear();
console.log("После очистки:", buyer.getData());
console.log("Валидация после очистки:", buyer.validate()); // должны быть ошибки

console.log("\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===");