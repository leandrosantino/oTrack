import 'reflect-metadata';

import { container } from "tsyringe";
import { AxiosHttpClient } from "./providers/http-client/AxiosHttpClient";
import { AuthService } from "./services/auth-service/AuthService";


export const httpClient = container.resolve(AxiosHttpClient)
container.registerInstance('HttpClient', httpClient)

export const authService = container.resolve(AuthService)
container.registerInstance('AuthService', authService)


