import { IApi, ApiResponseProducts, ApiOrderResponse, IOrder } from "../../types";

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<ApiResponseProducts> {
    return this.api.get<ApiResponseProducts>("/product/");
  }

  async createOrder(orderData: IOrder): Promise<ApiOrderResponse> {
    return this.api.post<ApiOrderResponse>("/order/", orderData, "POST");
  }
}
