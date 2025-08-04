import { ServiceOrder } from "service-order/ServiceOrder";
import { CreateServiceOrderRequestDTO } from "service-order/DTOs";
import { ICreateServiceOrder } from "service-order/interfaces/ICreateServiceOrder";
import { CreateServiceOrder } from "service-order/usecases/CreateServiceOrder";
import { Observer } from "lib/utils/Observer";
import { Inject, Injectable } from "@nestjs/common";


@Injectable()
export class CreateServiceOrderObservable implements ICreateServiceOrder {

  constructor(
    @Inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
    @Inject('CreateServiceOrderObserver') private readonly observer: Observer<ServiceOrder>
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.observer.notifyAll(serviceOrder)
    return serviceOrder
  }

}
