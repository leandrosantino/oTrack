import { ServiceOrder } from "@/domain/entities/ServiceOrder";


export interface IServiceOrdersService {
  getAll(): Promise<ServiceOrder[]>
  updateKanbanPosition(data: UpdateServiceOrderKanbanPositionRequestDTO): Promise<ServiceOrder>
  startRealtime(): Promise<void>
  onUpdated(cb: (order: ServiceOrder) => void): void
  onCreated(cb: (order: ServiceOrder) => void): void
}

export interface UpdateServiceOrderKanbanPositionRequestDTO {
  id: number
  previousIndex: number
  postIndex: number
  status: ServiceOrder['status']
}