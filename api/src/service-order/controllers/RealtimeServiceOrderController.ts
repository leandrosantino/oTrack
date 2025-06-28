import { inject, injectable } from "tsyringe";
import { FastifyRequest } from 'fastify'
import { WebSocket } from 'ws';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "service-order/DTOs";
import { ServiceOrder } from "service-order/ServiceOrder";
import { UpdateServiceOrderKanbanPosition } from "service-order/usecases/UpdateServiceOrderKanbanPosition";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { Validator } from "shared/Validator/Validator";
import { WebSocketAuthMiddleware } from "authentication/middlewares/WebSocketAuthMiddleware";
import { Observer } from "shared/utils/Observer";
import { WebSocketEventClient } from "shared/EventClient/WebSocketEventClient";
import { Role } from "user/Role";
import { ListServiceOrders } from "service-order/usecases/ListServiceOrders";



@injectable()
export class RealtimeServiceOrderController implements ControllerInterface {

  constructor(
    @inject('WebSocketAuthMiddleware') private readonly webSocketAuthMiddleware: WebSocketAuthMiddleware,
    @inject('CreateServiceOrderObserver') private readonly createServiceOrderObserver: Observer<ServiceOrder>,
    @inject('ListServiceOrders') private readonly listServiceOrders: ListServiceOrders,
    @inject('UpdateServiceOrderKanbanPosition') private readonly updateServiceOrderKanbanPosition: UpdateServiceOrderKanbanPosition,
    @inject('UpdateKanbanPositionValidator') private readonly updateKanbanPositionValidator: Validator<UpdateServiceOrderKanbanPositionRequestDTO>
  ) { }

  clients: WebSocketEventClient[] = []

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const client = new WebSocketEventClient(socket, request.user!)
    this.clients.push(client)

    this.listServiceOrders.execute().then(orders => {
      client.emit('connected', orders)
    })

    const unsubstribeCreateServiceOrder = this.createServiceOrderObserver.subscribe(createdServiceOrder => {
      client.emit('created', createdServiceOrder)
    })

    client.on('updateKanbanPosition', async (data) => {
      const parsedData = this.updateKanbanPositionValidator.parse(data).orElseNull()
      if (!parsedData) {
        client.emit('updateKanbanPosition', null)
        return
      }
      const updatedServiceOrder = await this.updateServiceOrderKanbanPosition.execute(parsedData)
      client.emit('updateKanbanPosition', updatedServiceOrder)
      this.clients
        .filter(savedClient => savedClient !== client)
        .forEach(client => {
          client.emit('updated', updatedServiceOrder)
        })

    })

    client.onClose(() => {
      unsubstribeCreateServiceOrder()
      this.clients = this.clients.filter(savedClient => savedClient !== client)
    })
  }

  routes: FastifyPluginAsyncZod = async (app) => {
    app.route({
      onRequest: this.webSocketAuthMiddleware.build([Role.ADMIN]),
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
