import { CreateServiceOrderRequestDto } from "service-order/dto/CreateServiceOrderRequestDto";
import { ServiceOrder } from "service-order/entities/ServiceOrder";

export interface ICreateServiceOrder {
  execute(data: CreateServiceOrderRequestDto): Promise<ServiceOrder>
}
