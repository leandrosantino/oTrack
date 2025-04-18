import { container } from "tsyringe";
import { AxiosHttpClient } from "./domain/providers/http-client/AxiosHttpClient";
import { AuthService } from "./domain/services/auth-service/AuthService";
import { ServiceOrdersService } from "./domain/services/service-orders-service/ServiceOrdersService";
import { Err, Ok } from "./lib/result-handler";


(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.registerSingleton('HttpClient', AxiosHttpClient)
container.registerSingleton('AuthService', AuthService)
container.registerSingleton('ServiceOrdersService', ServiceOrdersService)