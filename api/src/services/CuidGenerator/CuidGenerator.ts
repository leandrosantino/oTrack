import { singleton } from "tsyringe";
import { ICuidGenerator } from "./ICuidGenerator";
import { createId } from "@paralleldrive/cuid2";

@singleton()
export class CuidGenerator implements ICuidGenerator {

  generate(): string {
    return createId()
  }

}
