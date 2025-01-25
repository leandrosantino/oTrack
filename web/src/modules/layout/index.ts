import { container } from "tsyringe"
import { LayoutController } from "./layout.controller"
import { LayoutView } from "./layout.view"

export const controller = container.resolve(LayoutController)
export const Layout = () => LayoutView({ controller })