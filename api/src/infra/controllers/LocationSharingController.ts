import { inject, injectable } from "tsyringe"
import { FastifyRequest } from 'fastify'
import { WebSocket } from 'ws'
import { AuthMiddleware } from "infra/middlewares/AuthMiddleware"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { WsClient } from "infra/websocket/WsClient"
import { LocationSharing } from "application/use-cases/user/LocationSharing"
import { Roules } from "domain/entities/user/Roule"
import { User } from "domain/entities/user/User"

@injectable()
export class LocationSharingController {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('LocationSharing') private readonly locationSharing: LocationSharing
  ) { }

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const { id } = request.query as { id: number };
    const client = new WsClient(socket, { id: Number(id), roule: Roules.ADMIN } as User)
    this.locationSharing.execute(client)
  }

  routes: FastifyPluginAsyncZod = async (app) => {
    app.addHook('onRequest', this.authMiddleware.build([Roules.ADMIN]))
    app.route({
      schema: {
        tags: ['websocket'],
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/location',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
