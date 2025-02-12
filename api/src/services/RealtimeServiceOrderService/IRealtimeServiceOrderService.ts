import { WsClient } from "utils/WsClient";

export interface IRealtimeServiceOrderService {
  execute(client: WsClient): void
}
