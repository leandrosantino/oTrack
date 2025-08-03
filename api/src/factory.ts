import { container } from "tsyringe";
import { LocalLogger } from "shared/services/Logging/LocalLogger";
import { RealtimeServiceOrderController } from "service-order/controllers/RealtimeServiceOrderController";
import { ServiceOrdersController } from "service-order/controllers/ServiceOrdersController";
import { LocationSharingController } from "user/controllers/LocationSharingController";

import 'authentication/factory'
import 'service-order/factory'
import 'user/factory'
import { ResendMailService } from "shared/services/MailService/ResendMailService";


container.registerSingleton('Logger', LocalLogger)

//Services
container.registerSingleton('ResendMailService', ResendMailService)

container.registerInstance('Properties', properties)

//Controllers
export const serviceOrdersController = container.resolve(ServiceOrdersController)
export const realtimeServiceOrderController = container.resolve(RealtimeServiceOrderController)
export const locationSharingController = container.resolve(LocationSharingController)
