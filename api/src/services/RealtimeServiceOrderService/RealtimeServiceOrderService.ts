import { inject, singleton } from "tsyringe";
import { WsClient } from "utils/WsClient";
import { IRealtimeServiceOrderService } from "./IRealtimeServiceOrderService";
import z from "zod";
import { ServiceOrderStatus } from "entities/service-order/ServiceOrderStatus";
import { CreateServiceOrderObservable } from "use-cases/service-order/wrappers/CreateServiceOrderObservable";
import { IUpdateServiceOrder } from "use-cases/service-order/types";
import { UpdateServiceOrderObservable } from "use-cases/service-order/wrappers/UpdateServiceOrderObservable";
import { UpdateServiceOrderKanbanPosition } from "use-cases/service-order/UpdateServiceOrderKanbanPosition";

@singleton()
export class RealtimeServiceOrderService implements IRealtimeServiceOrderService {

  constructor(
    @inject('CreateServiceOrderObserver') private readonly createServiceOrder: CreateServiceOrderObservable,
    @inject('UpdateServiceOrderKanbanPosition') private readonly updateServiceOrder: UpdateServiceOrderKanbanPosition
  ) { }

  private UPDATE_PAYLOAD_SCHEMA = z.object({
    id: z.number(),
    status: z.nativeEnum(ServiceOrderStatus),
    previousIndex: z.number().optional(),
    postIndex: z.number().optional(),
  })

  clients: WsClient[] = []

  execute(client: WsClient): void {
    this.clients.push(client)

    const unsubstribeCreateServiceOrder = this.createServiceOrder.subscribe(createdServiceOrder => {
      client.emit('created', createdServiceOrder)
    })

    client.on('update', async (data) => {
      try {
        const { id, status, previousIndex, postIndex } = this.UPDATE_PAYLOAD_SCHEMA.parse(data)
        const updatedServiceOrder = await this.updateServiceOrder.execute({ id, status, previousIndex, postIndex })
        client.emit('updateReturn', updatedServiceOrder)
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
