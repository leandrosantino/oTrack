import { IServiceOrderRepository } from "service-order/interfaces/IServiceOrderRepository";
import { inject, singleton } from "tsyringe";


@singleton()
export class ListServiceOrders {
  constructor(
    @inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  async execute() {
    return await this.serviceOrderRepository.findMany()
  }

}
