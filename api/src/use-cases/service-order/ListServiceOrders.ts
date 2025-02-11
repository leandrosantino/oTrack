import { IServiceOrderRepository } from "entities/service-order/IServiceOrderRepository";
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
