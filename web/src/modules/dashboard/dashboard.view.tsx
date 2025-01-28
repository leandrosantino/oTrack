import { DashboardController } from "./dashboard.controller"

type props = {
  controller: DashboardController
}

export function DashboardView({ controller }: props) {

  controller.use()

  return (
    <div>Dashboard</div>
  )
}