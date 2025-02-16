import { ServiceOrder } from "entities/service-order/ServiceOrder";

export type CreateServiceOrderRequestDTO = Omit<ServiceOrder, 'id' | 'date' | 'index'> & {
  date: string;
}

export type UpdateServiceOrderRequestDTO = Partial<CreateServiceOrderRequestDTO> & { id: number, index: number }

export type UpdateServiceOrderKanbanPositionRequestDTO = {
  id: number
  status: ServiceOrder['status']
  previousIndex?: number
  postIndex?: number
}

export interface ICreateServiceOrder {
  execute(data: CreateServiceOrderRequestDTO): Promise<ServiceOrder>
}

export interface IUpdateServiceOrder {
  execute(data: UpdateServiceOrderRequestDTO): Promise<ServiceOrder>
}
