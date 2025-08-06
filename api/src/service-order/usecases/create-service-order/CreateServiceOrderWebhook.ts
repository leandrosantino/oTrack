import { CreateServiceOrder } from "service-order/usecases/create-service-order/CreateServiceOrder";
import { Inject, Injectable } from "@nestjs/common";
import { CreateServiceOrderRequestDto } from "service-order/dto/CreateServiceOrderRequestDto";
import { ServiceOrderRepository } from "service-order/repository/ServiceOrderRepository";
import { HttpClient } from "shared/services/HttpClient/HttpCLient";


@Injectable()
export class CreateServiceOrderObservable extends CreateServiceOrder {

  constructor(
    @Inject('ServiceOrderRepository') serviceOrderRepository: ServiceOrderRepository,
    @Inject('HttpClient') private readonly httpClient: HttpClient
  ) {
    super(serviceOrderRepository)
  }

  async execute(data: CreateServiceOrderRequestDto) {
    const serviceOrder = await super.execute(data)
    this.httpClient.post('example', serviceOrder)
    return serviceOrder
  }

}
