import { container } from "tsyringe";
import { HomeController } from "./home.controller";
import { HomeView } from "./home.view";


const controller = container.resolve(HomeController)
export const Home = () => HomeView({ controller })
