import { ServiceOrder } from "@/domain/entities/ServiceOrder";


export interface IServiceOrdersService {
  getAll(): Promise<ServiceOrder[]>
}