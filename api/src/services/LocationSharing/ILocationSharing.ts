import { WsClient } from "utils/WsClient";

export interface ILocationSharing {
  execute(client: WsClient): void
}
