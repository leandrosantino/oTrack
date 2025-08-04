import { Inject, Injectable } from "@nestjs/common";
import { IServiceOrderRepository } from "service-order/interfaces/IServiceOrderRepository";
import { inject, singleton } from "tsyringe";


@Injectable()
export class ListServiceOrders {
  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  async execute() {
    return await this.serviceOrderRepository.findMany()
  }

}
