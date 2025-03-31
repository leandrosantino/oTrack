import { ServiceOrderStatus } from "./ServiceOrderStatus";
import { ServiceOrderType } from "./ServiceOrderType";

export interface ServiceOrder {
  id: number;
  description: string;
  date: Date
  status: ServiceOrderStatus
  type: ServiceOrderType
  userId: number,
  index: number
}
