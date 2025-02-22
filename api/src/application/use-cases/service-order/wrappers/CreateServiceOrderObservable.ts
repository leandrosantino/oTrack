import { inject, singleton } from "tsyringe";
import { Observer } from "application/events/Observer";
import { CreateServiceOrder } from "../CreateServiceOrder";
import { ICreateServiceOrder, CreateServiceOrderRequestDTO } from "../types";
import { ServiceOrder } from "domain/entities/service-order/ServiceOrder";

@singleton()
export class CreateServiceOrderObservable implements ICreateServiceOrder {

  constructor(
    @inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
    @inject('CreateServiceOrderObserver') private readonly observer: Observer<ServiceOrder>
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.observer.notifyAll(serviceOrder)
    return serviceOrder
  }

}
