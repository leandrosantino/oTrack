import { container } from "tsyringe"
import { Observer } from "shared/utils/Observer"
import { ServiceOrderRepository } from "./repository/ServiceOrderRepository"
import { CreateServiceOrder } from "./usecases/CreateServiceOrder"
import { ListServiceOrders } from "./usecases/ListServiceOrders"
import { UpdateServiceOrder } from "./usecases/UpdateServiceOrder"
import { UpdateServiceOrderKanbanPosition } from "./usecases/UpdateServiceOrderKanbanPosition"
import { UpdateKanbanPositionValidator } from "./validators/UpdateKanbanPositionValidator"
import { CreateServiceOrderObservable } from "./wrappers/CreateServiceOrderObservable"

//Repositories
container.registerSingleton('ServiceOrderRepository', ServiceOrderRepository)

//Use cases
container.registerSingleton('CreateServiceOrder', CreateServiceOrder)
container.registerSingleton('CreateServiceOrderObservable', CreateServiceOrderObservable)
container.registerSingleton('UpdateServiceOrder', UpdateServiceOrder)
container.registerSingleton('UpdateServiceOrderKanbanPosition', UpdateServiceOrderKanbanPosition)
container.registerSingleton('ListServiceOrders', ListServiceOrders)

//Wrappers
container.registerSingleton('CreateServiceOrderObserver', Observer)

//Validators
container.registerSingleton('UpdateKanbanPositionValidator', UpdateKanbanPositionValidator)
