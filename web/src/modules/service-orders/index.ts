import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import { container } from "tsyringe";
import { ServiceOrdersController } from "./service-orders.controller";
import { ServiceOrdersView } from "./service-orders.view";


export function ServiceOrders() {
  const controller = container.resolve(ServiceOrdersController)
  return ServiceOrdersView({ controller })
}

export const serviceOrders: ServiceOrder[] = [
  { id: 1, description: "Criar documentação", priority: "corrective", date: new Date(), status: 'inProgress', userId: 1 },
  { id: 2, description: "Revisar pull requests", priority: "corrective", date: new Date(), status: 'pending', userId: 1 },
  { id: 3, description: "Atualizar dependências", priority: "scheduled", date: new Date(), status: 'pending', userId: 1 },
  { id: 8, description: "Atualizar dependências", priority: "scheduled", date: new Date(), status: 'pending', userId: 1 },
  { id: 9, description: "Atualizar dependências", priority: "scheduled", date: new Date(), status: 'inProgress', userId: 1 },
  { id: 10, description: "Atualizar dependências", priority: "corrective", date: new Date(), status: 'done', userId: 1 },
  { id: 11, description: "Atualizar dependências", priority: "scheduled", date: new Date(), status: 'done', userId: 1 },
  { id: 12, description: "Atualizar dependências", priority: "corrective", date: new Date(), status: 'done', userId: 1 },
] 