import { container } from "tsyringe";
import { DashboardController } from "./dashboard.controller";
import { DashboardView } from "./dashboard.view";


const controller = container.resolve(DashboardController)

export const Dashboard = () => DashboardView({ controller })