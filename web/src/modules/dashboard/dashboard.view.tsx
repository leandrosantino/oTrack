import { DashboardController } from "./dashboard.controller"


export function DashboardView(controller: DashboardController) {

  controller.use()

  return (
    <div>Dashboard</div>
  )
}