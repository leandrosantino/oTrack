import { ServiceOrder } from "service-order/entities/ServiceOrder";

export type UpdateServiceOrderKanbanPositionRequestDto = {
  id: number
  status: ServiceOrder['status']
  previousIndex?: number
  postIndex?: number
}

