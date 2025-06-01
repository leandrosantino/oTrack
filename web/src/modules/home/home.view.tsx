import { Home } from "./home.controller"

export function HomeView(controller: Home){

  return (
    <div>Hello, word! {controller.name}</div>
  )

}