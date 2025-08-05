import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Protected } from 'lib/decorators/Protected';
import { CreateServiceOrderRequestDto } from 'service-order/dto/CreateServiceOrderRequestDto';
import { ICreateServiceOrder } from 'service-order/usecases/create-service-order/ICreateServiceOrder';
import { ListServiceOrders } from 'service-order/usecases/list-service-orders/ListServiceOrders';
import { Role } from 'user/entities/Role';

@ApiTags('Service Orders')
@Controller('service-order')
export class ServiceOrdersController {

  constructor(
    private readonly listServiceOrders: ListServiceOrders,
    @Inject('CreateServiceOrderObservable') private readonly createServiceOrder: ICreateServiceOrder
  ) { }

  @Get()
  @Protected([Role.ADMIN])
  async getAll() {
    const serviceOrders = await this.listServiceOrders.execute()
    return serviceOrders
  }

  @Post()
  @Protected([Role.ADMIN])
  async create(@Body() body: CreateServiceOrderRequestDto) {
    const createdServiceOrder = await this.createServiceOrder.execute(body)
    return createdServiceOrder
  }

}
