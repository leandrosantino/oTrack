import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { ControllerInterface } from "interfaces/ControllerInterface";
import { WebSocket } from 'ws';
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Roules } from "entities/user/Roule";
import { WsClient } from "utils/WsClient";
import { User } from "entities/user/User";
import { ILocationSharing } from "services/LocationSharing/ILocationSharing";

@injectable()
export class LocationSharingController implements ControllerInterface {

  constructor(
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
    @inject('LocationSharing') private readonly locationSharing: ILocationSharing
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
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/location',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
