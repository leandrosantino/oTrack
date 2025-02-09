import { EntityRepository } from "interfaces/EntityRepository";
import { ServiceOrder } from "./ServiceOrder";

export interface IServiceOrderRepository extends EntityRepository<ServiceOrder, number> {

}
