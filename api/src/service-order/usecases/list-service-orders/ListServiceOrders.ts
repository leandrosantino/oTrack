import { Inject, Injectable } from "@nestjs/common";
import { ServiceOrderRepository } from "service-order/repository/ServiceOrderRepository";
import { inject, singleton } from "tsyringe";


@Injectable()
export class ListServiceOrders {
  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: ServiceOrderRepository
  ) { }

  async execute() {
    return await this.serviceOrderRepository.findMany()
  }

}
