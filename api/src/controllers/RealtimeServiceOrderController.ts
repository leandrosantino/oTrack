import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { ControllerInterface } from "interfaces/ControllerInterface";
import { WebSocket } from 'ws';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Roules } from "entities/user/Roule";
import { WsClient } from "utils/WsClient";
import { IRealtimeServiceOrderService } from "services/RealtimeServiceOrderService/IRealtimeServiceOrderService";
import { WebSocketAuthMiddleware } from "middlewares/WebSocketAuthMiddleware";


@injectable()
export class RealtimeServiceOrderController implements ControllerInterface {

  constructor(
    @inject('WebSocketAuthMiddleware') private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
    @inject('RealtimeServiceOrderService') private readonly realtimeServiceOrderService: IRealtimeServiceOrderService
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
