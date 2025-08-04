import { IServiceOrderRepository } from "service-order/interfaces/IServiceOrderRepository";
import { UpdateServiceOrderRequestDTO } from "../DTOs";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateServiceOrder {

  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  async execute(entity: UpdateServiceOrderRequestDTO) {
    const { date, ...rest } = entity
    return await this.serviceOrderRepository.update({
      ...rest,
      date: date ? new Date(date) : undefined
    })
  }

}
