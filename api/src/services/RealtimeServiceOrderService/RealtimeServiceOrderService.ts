import { inject, singleton } from "tsyringe";
import { CreateServiceOrderObserver } from "use-cases/service-order/CreateServiceOrderObserver";
import { WsClient } from "utils/WsClient";
import { IRealtimeServiceOrderService } from "./IRealtimeServiceOrderService";
import z from "zod";
import { UpdateServiceOrder } from "use-cases/service-order/UpdateServiceOrder";
import { ServiceOrderStatus } from "entities/service-order/ServiceOrderStatus";

@singleton()
export class RealtimeServiceOrderService implements IRealtimeServiceOrderService {

  constructor(
    @inject('CreateServiceOrderObserver') private readonly createServiceOrder: CreateServiceOrderObserver,
    @inject('UpdateServiceOrder') private readonly updateServiceOrder: UpdateServiceOrder
  ) { }

  private UPDATE_PAYLOAD_SCHEMA = z.object({
    id: z.number(),
    status: z.nativeEnum(ServiceOrderStatus),
    index: z.number(),
  })

  clients: WsClient[] = []

  execute(client: WsClient): void {
    this.clients.push(client)

    const unsubstribeCreateServiceOrder = this.createServiceOrder.subscribe(createdServiceOrder => {
      console.log("Create notify client: " + client.profile?.username)
      client.emit('created', createdServiceOrder)
    })

    client.on('update', async (data) => {
      try {
        const { id, index, status } = this.UPDATE_PAYLOAD_SCHEMA.parse(data)
        const updatedServiceOrder = await this.updateServiceOrder.execute({ id, index, status })
        this.clients
          .filter(savedClient => savedClient !== client)
          .forEach(client => {
            client.emit('updated', updatedServiceOrder)
          })
      } catch (e) { }
    })

    client.onClose(() => {
      unsubstribeCreateServiceOrder()
    })

  }
}
