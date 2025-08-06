import { Module } from '@nestjs/common';
import { RealtimeServiceOrderService } from './services/realtime-service-order-service/realtime-service-order.service';
import { ListServiceOrders } from './usecases/list-service-orders/ListServiceOrders';
import { UpdateServiceOrderKanbanPosition } from './usecases/update-service-order-kanban-position/UpdateServiceOrderKanbanPosition';
import { UpdateKanbanPositionValidator } from './usecases/update-service-order-kanban-position/UpdateKanbanPositionValidator';
import { Observer } from 'lib/utils/Observer';
import { PrismaServiceOrderRepository } from './repository/PrismaServiceOrderRepository';
import { UpdateServiceOrder } from './usecases/update-service-order/UpdateServiceOrder';
import { CreateServiceOrderObservable } from './usecases/create-service-order/CreateServiceOrderObservable';
import { CreateServiceOrder } from './usecases/create-service-order/CreateServiceOrder';
import { ServiceOrdersController } from './controllers/service-orders-controller/service-orders.controller';
import { AuthModule } from 'authentication/authentication.module';

@Module({
  imports: [AuthModule],
  providers: [
    RealtimeServiceOrderService,
    ListServiceOrders,
    UpdateServiceOrderKanbanPosition,
    UpdateServiceOrder,
    { provide: 'CreateServiceOrderObserver', useClass: Observer },
    { provide: 'CreateServiceOrderObservable', useClass: CreateServiceOrderObservable },
    { provide: 'CreateServiceOrder', useClass: CreateServiceOrder },
    { provide: 'UpdateKanbanPositionValidator', useClass: UpdateKanbanPositionValidator },
    { provide: 'ServiceOrderRepository', useClass: PrismaServiceOrderRepository }
  ],
  controllers: [ServiceOrdersController]
})
export class ServiceOrderModule { }
