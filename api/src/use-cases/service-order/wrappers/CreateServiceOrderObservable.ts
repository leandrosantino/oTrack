import { inject, singleton } from "tsyringe";
import { ServiceOrder } from "entities/service-order/ServiceOrder";
import { Observer } from "utils/Observer";
import { CreateServiceOrder } from "../CreateServiceOrder";
import { ICreateServiceOrder, CreateServiceOrderRequestDTO } from "../types";

@singleton()
export class CreateServiceOrderObservable implements ICreateServiceOrder {

  private observer = new Observer<ServiceOrder>()

  constructor(
    @inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.observer.notifyAll(serviceOrder)
    return serviceOrder
  }

  subscribe(cb: (data: ServiceOrder) => void): VoidFunction {
    return this.observer.subscribe(cb);
  }


}
