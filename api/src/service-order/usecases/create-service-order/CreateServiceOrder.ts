import { ServiceOrderRepository } from "service-order/repository/ServiceOrderRepository";
import { ICreateServiceOrder } from "./ICreateServiceOrder";
import { Inject, Injectable } from "@nestjs/common";
import { CreateServiceOrderRequestDto } from "service-order/dto/CreateServiceOrderRequestDto";

@Injectable()
export class CreateServiceOrder implements ICreateServiceOrder {
  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: ServiceOrderRepository
  ) { }

  private readonly STEP_LENGTH = 1000

  async execute(data: CreateServiceOrderRequestDto) {
    const { date, ...rest } = data
    const higherIndex = await this.serviceOrderRepository.getHigherIndex()
    return this.serviceOrderRepository.create({
      ...rest,
      index: higherIndex + this.STEP_LENGTH,
      date: new Date(date)
    })
  }

}
