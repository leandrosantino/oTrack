import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { WebSocket } from 'ws';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { WebSocketAuthMiddleware } from "shared/middlewares/WebSocketAuthMiddleware";
import { WebSocketEventClient } from "shared/EventClient/WebSocketEventClient";
import { Roules } from "user/Roule";
import { User } from "user/User";


@injectable()
export class LocationSharingController implements ControllerInterface {

  constructor(
    @inject('WebSocketAuthMiddleware') private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
  ) { }

  private clients = new Map<number, WebSocketEventClient>();

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const { id } = request.query as { id: number };
    const client = new WebSocketEventClient(socket, { id: Number(id), roule: Roules.ADMIN } as User)
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

  routes: FastifyPluginAsyncZod = async (app) => {
    app.addHook('onRequest', this.webSocketAuthMiddleware.build([Roules.ADMIN]))
    app.route({
      schema: {
        tags: ['websocket'],
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/location/:ticket',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
