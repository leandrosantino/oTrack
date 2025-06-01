import { component } from "@/lib/@component";
import { ComponentController } from "@/lib/ComponentController";
import { ComponentView } from "@/lib/ComponentView";
import { HomeView } from "./home.view";

@component(HomeView)
export class Home extends ComponentController {

  name = 'Home';

}

export default Home.View as ComponentView<Home>;