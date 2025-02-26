import { inject, singleton } from "tsyringe";
import { ServiceOrder } from "service-order/ServiceOrder";
import { CreateServiceOrderRequestDTO } from "service-order/DTOs";
import { ICreateServiceOrder } from "service-order/interfaces/ICreateServiceOrder";
import { CreateServiceOrder } from "service-order/usecases/CreateServiceOrder";
import { Observer } from "shared/utils/Observer";


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
