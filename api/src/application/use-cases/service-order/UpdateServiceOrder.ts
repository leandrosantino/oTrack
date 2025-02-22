import { inject, singleton } from "tsyringe";
import { IUpdateServiceOrder, UpdateServiceOrderRequestDTO } from "./types";
import { IServiceOrderRepository } from "domain/entities/service-order/IServiceOrderRepository";

@singleton()
export class UpdateServiceOrder implements IUpdateServiceOrder {

  constructor(
    @inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  async execute(entity: UpdateServiceOrderRequestDTO) {
    const { date, ...rest } = entity
    return await this.serviceOrderRepository.update({
      ...rest,
      date: date ? new Date(date) : undefined
    })
  }

}
