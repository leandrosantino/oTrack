import { EntityRepository } from "shared/interfaces/EntityRepository";
import { ServiceOrder } from "../entities/ServiceOrder";

export interface ServiceOrderRepository extends EntityRepository<ServiceOrder, number> {
  update(entity: Partial<ServiceOrder>): Promise<ServiceOrder>
  getHigherIndex(): Promise<number>
}
