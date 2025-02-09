import { OrderStatus } from "entities/service-order/OrderStatus";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ControllerInterface } from "interfaces/ControllerInterface";
import { inject, singleton } from "tsyringe";
import { CreateServiceOrder } from "use-cases/service-order/CreateServiceOrder";
import z from "zod";

@singleton()
export class ServiceOrdersController implements ControllerInterface {

  constructor(
    @inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
  ) { }

  private CREATE_SERVICE_ORDER_SCHEMA = z.object({
    id: z.number(),
    description: z.string(),
    date: z.string().datetime(),
    status: z.nativeEnum(OrderStatus),
    userId: z.number(),
  })

  routes: FastifyPluginAsyncZod = async (app) => {
    app.post('/', {
      schema: {
        tags: ['Service Orders'],
        description: 'Create a new service order',
        body: this.CREATE_SERVICE_ORDER_SCHEMA.omit({ id: true }),
        response: {
          201: this.CREATE_SERVICE_ORDER_SCHEMA
            .omit({ date: true })
            .and(z.object({ date: z.date() }))
            .describe('Created Service Order')
        }
      }
    }, async (request, reply) => {
      const data = request.body
      const createdServiceOrder = await this.createServiceOrder.execute(data)
      reply.status(201).send(createdServiceOrder)
    })
  };

}
