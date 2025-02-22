import { inject, injectable } from "tsyringe"
import { FastifyRequest } from 'fastify'
import { WebSocket } from 'ws'
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { WsClient } from "infra/websocket/WsClient"
import { WebSocketAuthMiddleware } from "infra/middlewares/WebSocketAuthMiddleware"
import { RealtimeSharingServiceOrder } from "application/use-cases/service-order/RealtimeSharingServiceOrder"
import { Roules } from "domain/entities/user/Roule"


@injectable()
export class RealtimeServiceOrderController {

  constructor(
    @inject('WebSocketAuthMiddleware') private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
    @inject('RealtimeServiceOrderService') private readonly realtimeServiceOrderService: RealtimeSharingServiceOrder
  ) { }

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const client = new WsClient(socket, request.user!)
    this.realtimeServiceOrderService.execute(client)
  }

  routes: FastifyPluginAsyncZod = async (app) => {
    app.route({
      onRequest: this.webSocketAuthMiddleware.build([Roules.ADMIN]),
      schema: {
        tags: ['websocket'],
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/realtime/:ticket',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
