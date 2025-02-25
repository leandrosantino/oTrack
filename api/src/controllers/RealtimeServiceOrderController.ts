import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { ControllerInterface } from "interfaces/ControllerInterface";
import { WebSocket } from 'ws';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { Roules } from "entities/user/Roule";
import { WebSocketAuthMiddleware } from "middlewares/WebSocketAuthMiddleware";
import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { Validator } from "interfaces/Validator";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "use-cases/service-order/DTOs";
import { UpdateServiceOrderKanbanPosition } from "use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { Observer } from "utils/Observer";
import { WebSocketEventClient } from "utils/WebSocketEventClient";


@injectable()
export class RealtimeServiceOrderController implements ControllerInterface {

  constructor(
    @inject('WebSocketAuthMiddleware') private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
    @inject('CreateServiceOrderObserver') private readonly createServiceOrderObserver: Observer<ServiceOrder>,
    @inject('UpdateServiceOrderKanbanPosition') private readonly updateServiceOrderKanbanPosition: UpdateServiceOrderKanbanPosition,
    @inject('UpdateKanbanPositionValidator') private readonly updateKanbanPositionValidator: Validator<UpdateServiceOrderKanbanPositionRequestDTO>
  ) { }

  clients: WebSocketEventClient[] = []

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const client = new WebSocketEventClient(socket, request.user!)
    this.clients.push(client)

    const unsubstribeCreateServiceOrder = this.createServiceOrderObserver.subscribe(createdServiceOrder => {
      client.emit('created', createdServiceOrder)
    })

    client.on('updateKanbanPosition', async (data) => {
      const parsedData = this.updateKanbanPositionValidator.parse(data).orElseNull()
      if (!parsedData) {
        client.emit('updateKanbanPositionReturn', null)
        return
      }
      const updatedServiceOrder = await this.updateServiceOrderKanbanPosition.execute(parsedData)
      client.emit('updateKanbanPositionReturn', updatedServiceOrder)
      this.clients
        .filter(savedClient => savedClient !== client)
        .forEach(client => {
          client.emit('updated', updatedServiceOrder)
        })

    })

    client.onClose(() => {
      unsubstribeCreateServiceOrder()
    })
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
