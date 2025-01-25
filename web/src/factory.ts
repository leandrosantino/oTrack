import { container } from "tsyringe";
import { AxiosHttpClient } from "./domain/providers/http-client/AxiosHttpClient";
import { AuthService } from "./domain/services/auth-service/AuthService";

container.register('HttpClient', AxiosHttpClient)
container.register('AuthService', AuthService)

