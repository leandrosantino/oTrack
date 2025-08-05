import { ServiceOrderRepository } from "service-order/repository/ServiceOrderRepository";
import { Inject, Injectable } from "@nestjs/common";
import { UpdateServiceOrderRequestDto } from "service-order/dto/UpdateServiceOrderRequestDto";

@Injectable()
export class UpdateServiceOrder {

  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: ServiceOrderRepository
  ) { }

  async execute(entity: UpdateServiceOrderRequestDto) {
    const { date, ...rest } = entity
    return await this.serviceOrderRepository.update({
      ...rest,
      date: date ? new Date(date) : undefined
    })
  }

}
