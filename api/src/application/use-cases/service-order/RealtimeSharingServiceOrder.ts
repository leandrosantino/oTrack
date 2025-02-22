import { inject, singleton } from "tsyringe";
import { WsClient } from "infra/websocket/WsClient";
import { Observer } from "application/events/Observer";

import { Validator } from "application/validation/Validator";
import { UpdateServiceOrderKanbanPosition } from "application/use-cases/service-order/UpdateServiceOrderKanbanPosition";
import { UpdateServiceOrderKanbanPositionRequestDTO } from "application/use-cases/service-order/types";
import { ServiceOrder } from "domain/entities/service-order/ServiceOrder";

@singleton()
export class RealtimeSharingServiceOrder {

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
        const parsedData = this.updateKanbanPositionValidator.parse(data).orElseThrow()
        const updatedServiceOrder = await this.updateServiceOrderKanbanPosition.execute(parsedData)
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
