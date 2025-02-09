import { OrderStatus } from "./OrderStatus";

export interface ServiceOrder {
  id: number;
  description: string;
  date: Date
  status: OrderStatus
  userId: number
}
