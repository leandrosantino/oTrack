import { container } from "tsyringe";
import { ServiceOrdersController } from "./service-orders.controller";
import { ServiceOrdersView } from "./service-orders.view";


export function ServiceOrders() {
  const controller = container.resolve(ServiceOrdersController)
  return ServiceOrdersView({ controller })
}