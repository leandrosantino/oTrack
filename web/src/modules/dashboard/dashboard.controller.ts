import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { DashboardView } from "./dashboard.view";

@component(DashboardView)
export class DashboardController extends ComponentController {

  use() {



  }


}

export default DashboardController.View as ComponentView<DashboardController>