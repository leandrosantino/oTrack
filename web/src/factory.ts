import { container } from "tsyringe";
import { AxiosHttpClient } from "./domain/providers/http-client/AxiosHttpClient";
import { AuthService } from "./domain/services/auth-service/AuthService";
import { Err, Ok } from "./lib/result-handler";


(globalThis as any).Ok = Ok;
(globalThis as any).Err = Err;

container.register('HttpClient', AxiosHttpClient)
container.register('AuthService', AuthService)