import { IServiceOrderRepository } from "entities/service-order/IServiceOrderRepository";
import { inject, singleton } from "tsyringe";
import { UpdateServiceOrderRequestDTO } from "./DTOs";

@singleton()
export class UpdateServiceOrder {

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
