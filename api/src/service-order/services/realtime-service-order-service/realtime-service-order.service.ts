import { FastifyRequest, RouteHandlerMethod } from 'fastify'
import { WebSocket } from 'ws';
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UpdateServiceOrderKanbanPositionRequestDto } from "service-order/dto/UpdateServiceOrderKanbanPositionRequestDto";
import { ServiceOrder } from "service-order/entities/ServiceOrder";
import { UpdateServiceOrderKanbanPosition } from "service-order/usecases/update-service-order-kanban-position/UpdateServiceOrderKanbanPosition";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { Validator } from "lib/Validator/Validator";
import { Observer } from "lib/utils/Observer";
import { WebSocketEventClient } from "lib/EventClient/WebSocketEventClient";
import { ListServiceOrders } from "service-order/usecases/list-service-orders/ListServiceOrders";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { TicketProvider } from 'authentication/services/TicketProvider/TicketProvider';
import { Role } from 'user/entities/Role';
import { UnauthticatedException } from 'authentication/exceptions/UnauthticatedException';
import { UserProfile } from 'user/dto/UserProfile';
import { UnauthorizedException } from 'authentication/exceptions/UnauthorizedException';
import { CustonHttpException } from 'lib/utils/CustonHttpException';

@Injectable()
export class RealtimeServiceOrderService implements ControllerInterface {

  constructor(
    private readonly listServiceOrders: ListServiceOrders,
    private readonly updateServiceOrderKanbanPosition: UpdateServiceOrderKanbanPosition,
    @Inject('TicketProvider') private readonly ticketProvider: TicketProvider,
    @Inject('CreateServiceOrderObserver') private readonly createServiceOrderObserver: Observer<ServiceOrder>,
    @Inject('UpdateKanbanPositionValidator') private readonly updateKanbanPositionValidator: Validator<UpdateServiceOrderKanbanPositionRequestDto>
  ) { }

  clients: WebSocketEventClient[] = []

  private requiredRoles: Role[] = [Role.ADMIN]

  async webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const client = new WebSocketEventClient(socket, request.user!)
    this.clients.push(client)

    const isAuthorized = await this.authGard(request, client)
    if (!isAuthorized) {
      socket.close()
      return
    }

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
      method: 'GET',
      url: '/service-order/realtime/:ticket',
      handler: () => { },
      wsHandler: this.webSocketHandler.bind(this)
    })
  }

  async authGard(request: FastifyRequest, client: WebSocketEventClient) {
    const { ticket } = request.params as { ticket: string }

    if (!ticket) {
      client.emit('error', new UnauthticatedException().details())
      return false
    }

    const verifyTicketResult = await this.ticketProvider.use<UserProfile>(ticket)

    if (verifyTicketResult.failure) {
      client.emit('error', verifyTicketResult.error.details())
      return false
    }

    const { value: userProfile } = verifyTicketResult

    if (this.requiredRoles.length > 0 && !this.requiredRoles.includes(userProfile.role)) {
      client.emit('error', new UnauthorizedException().details())
      return false
    }

    request.user = userProfile
    return true
  }

}
