import { inject, singleton } from "tsyringe";
import { CreateServiceOrder } from "./CreateServiceOrder";
import { CreateServiceOrderRequestDTO } from "./types";
import { ServiceOrder } from "entities/service-order/ServiceOrder";

@singleton()
export class CreateServiceOrderObserver {

  private substribers: ((data: ServiceOrder) => void)[] = []

  constructor(
    @inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.notify(serviceOrder)
    return serviceOrder
  }

  subscribe(cb: (data: ServiceOrder) => void): VoidFunction {
    this.substribers.push(cb)
    return () => {
      this.substribers = this.substribers.filter(substriber => substriber !== cb)
    }
  }

  private async notify(data: ServiceOrder) {
    this.substribers.forEach(cb => cb(data))
  }

}
