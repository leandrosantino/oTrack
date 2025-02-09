import { IServiceOrderRepository } from "entities/service-order/IServiceOrderRepository";
import { inject, singleton } from "tsyringe";
import { CreateServiceOrderRequestDTO } from "./types";

@singleton()
export class CreateServiceOrder {
  constructor(
    @inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  async execute(data: CreateServiceOrderRequestDTO) {
    const { date, ...rest } = data
    return this.serviceOrderRepository.create({
      ...rest,
      date: new Date(date)
    })
  }

}
