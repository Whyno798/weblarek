import { IApi, ApiResponseProducts, ApiOrderResponse } from "../../types";
import { IProduct, IBuyer } from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<{ items: IProduct[] }> {
    return this.api.get<ApiResponseProducts>("/product/");
  }

  async createOrder(orderData: {
    items: IProduct[];
    buyer: IBuyer;
  }): Promise<{ total: number }> {
    return this.api.post<ApiOrderResponse>("/order/", orderData, "POST");
  }
}
