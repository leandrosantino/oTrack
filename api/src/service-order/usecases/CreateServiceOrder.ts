import { IServiceOrderRepository } from "service-order/interfaces/IServiceOrderRepository";
import { CreateServiceOrderRequestDTO } from "../DTOs";
import { ICreateServiceOrder } from "../interfaces/ICreateServiceOrder";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateServiceOrder implements ICreateServiceOrder {
  constructor(
    @Inject('ServiceOrderRepository') private readonly serviceOrderRepository: IServiceOrderRepository
  ) { }

  private readonly STEP_LENGTH = 1000

  async execute(data: CreateServiceOrderRequestDTO) {
    const { date, ...rest } = data
    const higherIndex = await this.serviceOrderRepository.getHigherIndex()
    return this.serviceOrderRepository.create({
      ...rest,
      index: higherIndex + this.STEP_LENGTH,
      date: new Date(date)
    })
  }

}
