import { Module } from '@nestjs/common';
import { RealtimeServiceOrderService } from './services/realtime-service-order-service/realtime-service-order.service';
import { ListServiceOrders } from './usecases/ListServiceOrders';
import { UpdateServiceOrderKanbanPosition } from './usecases/UpdateServiceOrderKanbanPosition';
import { UpdateKanbanPositionValidator } from './validators/UpdateKanbanPositionValidator';
import { Observer } from 'lib/utils/Observer';
import { ServiceOrderRepository } from './repository/ServiceOrderRepository';
import { UpdateServiceOrder } from './usecases/UpdateServiceOrder';
import { CreateServiceOrderObservable } from './wrappers/CreateServiceOrderObservable';
import { CreateServiceOrder } from './usecases/CreateServiceOrder';
import { ServiceOrdersController } from './controllers/service-orders-controller/service-orders.controller';

@Module({
  providers: [
    RealtimeServiceOrderService,
    ListServiceOrders,
    UpdateServiceOrderKanbanPosition,
    UpdateServiceOrder,
    { provide: 'CreateServiceOrderObserver', useClass: Observer },
    { provide: 'CreateServiceOrderObservable', useClass: CreateServiceOrderObservable },
    { provide: 'CreateServiceOrder', useClass: CreateServiceOrder },
    { provide: 'CreateServiceOrderObservable', useClass: CreateServiceOrderObservable },
    { provide: 'UpdateKanbanPositionValidator', useClass: UpdateKanbanPositionValidator },
    { provide: 'ServiceOrderRepository', useClass: ServiceOrderRepository }
  ],
  controllers: [ServiceOrdersController]
})
export class ServiceOrderModule { }
