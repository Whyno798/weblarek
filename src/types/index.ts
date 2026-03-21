export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export type TPayment = "card | cash";

export type ApiResponseProducts = {
  total: number;
  items: IProduct[];
};

export type ApiOrderRequest = {
  items: IProduct[];
  buyer: IBuyer;
};

export type ApiOrderResponse = {
  id: string;
  total: number;
};
