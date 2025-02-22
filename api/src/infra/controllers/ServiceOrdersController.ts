import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { AuthMiddleware } from "infra/middlewares/AuthMiddleware"
import { inject, singleton } from "tsyringe"
import { ListServiceOrders } from "application/use-cases/service-order/ListServiceOrders"
import { ICreateServiceOrder } from "application/use-cases/service-order/types"
import { UpdateServiceOrderKanbanPosition } from "application/use-cases/service-order/UpdateServiceOrderKanbanPosition"
import z from "zod"
import { ServiceOrderStatus } from "domain/entities/service-order/ServiceOrderStatus"
import { ServiceOrderType } from "domain/entities/service-order/ServiceOrderType"
import { Roules } from "domain/entities/user/Roule"

@singleton()
export class ServiceOrdersController {

  constructor(
    @inject('CreateServiceOrderObserver') private readonly createServiceOrder: ICreateServiceOrder,
    @inject('UpdateServiceOrderKanbanPosition') private readonly updateServiceOrderKanbanPosition: UpdateServiceOrderKanbanPosition,
    @inject('ListServiceOrders') private readonly listServiceOrders: ListServiceOrders,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
  ) { }

  private CREATE_SERVICE_ORDER_SCHEMA = z.object({
    id: z.number(),
    description: z.string(),
    date: z.date(),
    status: z.nativeEnum(ServiceOrderStatus),
    userId: z.number(),
    type: z.nativeEnum(ServiceOrderType),
  })

  routes: FastifyPluginAsyncZod = async (app) => {
    app.addHook('onRequest', this.authMiddleware.build([Roules.ADMIN]))
    app.post('/', {
      schema: {
        tags: ['Service Orders'],
        description: 'Create a new service order',
        security: [{ BearerAuth: [] }],
        body: this.CREATE_SERVICE_ORDER_SCHEMA
          .omit({ id: true, date: true })
          .and(z.object({ date: z.string().datetime() })),
        response: {
          201: this.CREATE_SERVICE_ORDER_SCHEMA.describe('Created Service Order')
        }
      }
    }, async (request, reply) => {
      const data = request.body
      const createdServiceOrder = await this.createServiceOrder.execute(data)
      reply.status(201).send(createdServiceOrder)
    })

    app.get('/', {
      schema: {
        tags: ['Service Orders'],
        description: 'Get all service orders',
        security: [{ BearerAuth: [] }],
      }
    }, async (_, reply) => {
      const serviceOrders = await this.listServiceOrders.execute()
      reply.status(200).send(serviceOrders)
    })

  };

}
