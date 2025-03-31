import { HomeController } from "./home.controller"

type props = {
  controller: HomeController
}

export function HomeView({controller}: props){

  controller.use()

  return (
    <div>Hello, word!</div>
  )

}