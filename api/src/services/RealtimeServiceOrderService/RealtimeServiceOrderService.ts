import { inject, singleton } from "tsyringe";
import { WsClient } from "utils/WsClient";
import { Observer } from "utils/Observer";

import { IRealtimeServiceOrderService } from "./IRealtimeServiceOrderService";
import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { Validator } from "interfaces/Validator";
import { UpdateServiceOrderKanbanPosition } from "use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "use-cases/service-order/types";

@singleton()
export class RealtimeServiceOrderService implements IRealtimeServiceOrderService {

  constructor(
    @inject('CreateServiceOrderObserver') private readonly createServiceOrderObserver: Observer<ServiceOrder>,
    @inject('UpdateServiceOrderKanbanPosition') private readonly updateServiceOrderKanbanPosition: UpdateServiceOrderKanbanPosition,
    @inject('UpdateKanbanPositionValidator') private readonly updateKanbanPositionValidator: Validator<UpdateServiceOrderKanbanPositionRequestDTO>
  ) { }

  clients: WsClient[] = []

  execute(client: WsClient): void {
    this.clients.push(client)

    const unsubstribeCreateServiceOrder = this.createServiceOrderObserver.subscribe(createdServiceOrder => {
      client.emit('created', createdServiceOrder)
    })

    client.on('updateKanbanPosition', async (data) => {
      try {
        const { id, status, previousIndex, postIndex } = this.updateKanbanPositionValidator.parse(data).orElseThrow('invalid data')
        const updatedServiceOrder = await this.updateServiceOrderKanbanPosition.execute({ id, status, previousIndex, postIndex })
        client.emit('updateKanbanPositionReturn', updatedServiceOrder)
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
