import { inject, singleton } from "tsyringe";
import { CreateServiceOrder } from "./CreateServiceOrder";
import { CreateServiceOrderRequestDTO } from "./types";

@singleton()
export class CreateServiceOrderObserver {

  private substribers: VoidFunction[] = []

  constructor(
    @inject('CreateServiceOrder') private readonly createServiceOrder: CreateServiceOrder,
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const serviceOrder = await this.createServiceOrder.execute(data)
    this.notify()
    return serviceOrder
  }

  subscribe(cb: VoidFunction) {
    this.substribers.push(cb)
  }

  private async notify() {
    this.substribers.forEach(cb => cb())
  }

}
