import { ServiceOrderStatus } from "service-order/ServiceOrderStatus";
import { ServiceOrderType } from "service-order/ServiceOrderType";
import { inject, singleton } from "tsyringe";
import { ICreateServiceOrder } from "service-order/interfaces/ICreateServiceOrder";
import { ListServiceOrders } from "service-order/usecases/ListServiceOrders";
import { UpdateServiceOrderKanbanPosition } from "service-order/usecases/UpdateServiceOrderKanbanPosition";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "shared/interfaces/ControllerInterface";
import { AuthMiddleware } from "shared/middlewares/AuthMiddleware";
import { Roules } from "user/Roule";
import z from "zod";

@singleton()
export class ServiceOrdersController implements ControllerInterface {

  constructor(
    @inject('CreateServiceOrderObservable') private readonly createServiceOrder: ICreateServiceOrder,
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
