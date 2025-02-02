import { container } from "tsyringe"
import { LayoutController } from "./layout.controller"
import { LayoutView } from "./layout.view"

export function Layout() {
  const controller = container.resolve(LayoutController)
  return LayoutView({ controller })
}