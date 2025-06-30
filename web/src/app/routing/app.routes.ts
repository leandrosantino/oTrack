import { Routes } from '@angular/router';
import { AuthLayout } from '../components/auth-layout/auth-layout';
import { Layout } from '../components/layout/layout';
import { ForgotPassword } from '../pages/forgot-password/forgot-password';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Products } from '../pages/products/products';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { ServiceOrders } from '../pages/service-orders/service-orders';
import { AuthGuard } from './auth-guard';
import { LoginGuard } from './login-guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'service-orders',
        component: ServiceOrders,
      },
      {
        path: 'products',
        component: Products,
      },
    ]
  },
  {
    path: "auth",
    canActivate: [LoginGuard],
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: 'reset-password/:ticket',
        component: ResetPassword
      }
    ]
  }
];