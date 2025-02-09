import { ServiceOrder } from "entities/service-order/ServiceOrder";

export type CreateServiceOrderRequestDTO = Omit<ServiceOrder, 'id' | 'date'> & {
  date: string;
}
