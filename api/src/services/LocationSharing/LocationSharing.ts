import { WsClient } from "utils/WsClient";
import { ILocationSharing } from "./ILocationSharing";
import { singleton } from "tsyringe";

@singleton()
export class LocationSharing implements ILocationSharing {

  private clients = new Map<number, WsClient>();

  execute(client: WsClient): void {
    this.clients.set(client.profile.id, client)

    client.on('subscribe', (targetId: number) => {
      const targetClient = this.clients.get(targetId)
      if (!targetClient) {
        client.emit('error', 'Erro - Usuário não encontrado ou desconectado');
        return
      }
      targetClient.on('locationUpdate', (location: string) => {
        client.emit('locationSender', { targetId, location })
      });
    })

    client.onClose(() => {
      console.log('Client closed')
      this.clients.delete(client.profile.id)
    })
  }

}
