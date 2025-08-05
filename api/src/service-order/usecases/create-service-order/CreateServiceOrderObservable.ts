import { ServiceOrder } from "service-order/entities/ServiceOrder";
import { ICreateServiceOrder } from "service-order/usecases/create-service-order/ICreateServiceOrder";
import { CreateServiceOrder } from "service-order/usecases/create-service-order/CreateServiceOrder";
import { Observer } from "lib/utils/Observer";
import { Inject, Injectable } from "@nestjs/common";
import { CreateServiceOrderRequestDto } from "service-order/dto/CreateServiceOrderRequestDto";


@Injectable()
export class CreateServiceOrderObservable implements ICreateServiceOrder {

  constructor(
    @Inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
    @Inject('CreateServiceOrderObserver') private readonly observer: Observer<ServiceOrder>
  ) { }

  async execute(data: CreateServiceOrderRequestDto) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.observer.notifyAll(serviceOrder)
    return serviceOrder
  }

}
