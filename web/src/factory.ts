import 'reflect-metadata';

import { container } from "tsyringe";
import { DashboardView } from './presentation/dashboard/dashboard.view';
import { LayoutController } from './presentation/layout/layout.controller';
import { LayoutView } from './presentation/layout/layout.view';
import { LoginView } from './presentation/login/login-view';
import { AxiosHttpClient } from "./providers/http-client/AxiosHttpClient";
import { AuthService } from "./services/auth-service/AuthService";


export const httpClient = container.resolve(AxiosHttpClient)
container.registerInstance('HttpClient', httpClient)

export const authService = container.resolve(AuthService)
container.registerInstance('AuthService', authService)

export const layoutController = container.resolve(LayoutController)

export const Dashboard = () => DashboardView()

export const Layout = () => LayoutView({
  controller: layoutController
})

export const Login = () => LoginView({})