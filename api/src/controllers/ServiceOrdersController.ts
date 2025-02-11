import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { ServiceOrderStatus } from "entities/service-order/ServiceOrderStatus";
import { ServiceOrderType } from "entities/service-order/ServiceOrderType";
import { Roules } from "entities/user/Roule";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "interfaces/ControllerInterface";
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import { inject, singleton } from "tsyringe";
import { CreateServiceOrder } from "use-cases/service-order/CreateServiceOrder";
import { CreateServiceOrderObserver } from "use-cases/service-order/CreateServiceOrderObserver";
import { ListServiceOrders } from "use-cases/service-order/ListServiceOrders";
import z from "zod";

@singleton()
export class ServiceOrdersController implements ControllerInterface {

  constructor(
    @inject('CreateServiceOrderObserver') private readonly createServiceOrder: CreateServiceOrderObserver,
    @inject('ListServiceOrders') private readonly listServiceOrders: ListServiceOrders,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware,
  ) {

    this.createServiceOrder.subscribe(() => {
      console.log('Service order created')
    })

  }

  private CREATE_SERVICE_ORDER_SCHEMA = z.object({
    id: z.number(),
    description: z.string(),
    date: z.date(),
    status: z.nativeEnum(ServiceOrderStatus),
    userId: z.number(),
    index: z.number(),
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
    }, async (request, reply) => {
      const serviceOrders = await this.listServiceOrders.execute()
      reply.status(200).send(serviceOrders)
    })

  };

}
