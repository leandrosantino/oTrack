import { container, singleton } from "tsyringe"

export function service(name?: string): ClassDecorator {
  return (target) => {
    console.log(`Registering service: ${target.name}`)
    singleton()(target as any)
    container.registerSingleton(name || target.name, target as any)
  }
}