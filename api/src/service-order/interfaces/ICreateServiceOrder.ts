import { ServiceOrder } from "service-order/ServiceOrder";
import { CreateServiceOrderRequestDTO } from "../DTOs";

export interface ICreateServiceOrder {
  execute(data: CreateServiceOrderRequestDTO): Promise<ServiceOrder>
}
