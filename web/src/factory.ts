import "./domain/providers/http-client/AxiosHttpClient";
import "./domain/services/auth-service/AuthService";
import "./domain/services/service-orders-service/ServiceOrdersService";
import { Err, Ok } from "./lib/result-handler";

(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;
