import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { ControllerInterface } from "interfaces/ControllerInterface";
import { WebSocket } from 'ws';
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Roules } from "entities/user/Roule";
import { WsClient } from "utils/WsClient";
import { User } from "entities/user/User";
import { IRealtimeServiceOrderService } from "services/RealtimeServiceOrderService/IRealtimeServiceOrderService";

@injectable()
export class RealtimeServiceOrderController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('RealtimeServiceOrderService') private readonly realtimeServiceOrderService: IRealtimeServiceOrderService
  ) { }

  i = 1

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const client = new WsClient(socket, { username: `Usuário ${this.i++}` } as User)
    this.realtimeServiceOrderService.execute(client)
  }

  routes: FastifyPluginAsyncZod = async (app) => {
    // app.addHook('onRequest', this.authMiddleware.build([Roules.ADMIN]))
    app.route({
      schema: {
        tags: ['websocket'],
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/realtime',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
