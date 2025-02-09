import { ServiceOrder } from "@/domain/entities/ServiceOrder";
import { container } from "tsyringe";
import { ServiceOrdersController } from "./service-orders.controller";
import { ServiceOrdersView } from "./service-orders.view";


export function ServiceOrders() {
  const controller = container.resolve(ServiceOrdersController)
  return ServiceOrdersView({ controller })
}

export const serviceOrders: ServiceOrder[] = [
  { id: 1, description: "Criar documentação", priority: "high", date: new Date(), status: 'inProgress', userId: 1 },
  { id: 2, description: "Revisar pull requests", priority: "medium", date: new Date(), status: 'pending', userId: 1 },
  { id: 3, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'pending', userId: 1 },
  { id: 8, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'pending', userId: 1 },
  { id: 9, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'inProgress', userId: 1 },
  { id: 10, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  { id: 11, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  { id: 12, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 13, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 14, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 15, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 16, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 17, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 18, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 19, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 20, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 21, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 22, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 23, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 24, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 25, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
  // { id: 26, description: "Atualizar dependências", priority: "low", date: new Date(), status: 'done', userId: 1 },
] 