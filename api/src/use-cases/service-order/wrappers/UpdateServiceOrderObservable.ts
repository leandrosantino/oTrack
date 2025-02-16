import { inject, singleton } from "tsyringe";
import { Observer } from "utils/Observer";
import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { IUpdateServiceOrder, UpdateServiceOrderRequestDTO } from "../types";
import { UpdateServiceOrder } from "../UpdateServiceOrder";

@singleton()
export class UpdateServiceOrderObservable implements IUpdateServiceOrder {

  private observer = new Observer<ServiceOrder>()

  constructor(
    @inject('UpdateServiceOrder') private readonly updateServiceOrder: UpdateServiceOrder
  ) { }

  async execute(entity: UpdateServiceOrderRequestDTO) {
    const serviceOrder = await this.updateServiceOrder.execute(entity)
    this.observer.notifyAll(serviceOrder)
    return serviceOrder
  }

  subscribe(cb: (data: ServiceOrder) => void): VoidFunction {
    return this.observer.subscribe(cb);
  }


}
