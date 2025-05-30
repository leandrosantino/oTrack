import { EntityRepository } from "shared/interfaces/EntityRepository";
import { ServiceOrder } from "../ServiceOrder";

export interface IServiceOrderRepository extends EntityRepository<ServiceOrder, number> {
  update(entity: Partial<ServiceOrder>): Promise<ServiceOrder>
  getHigherIndex(): Promise<number>
}
