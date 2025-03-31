import { singleton } from "tsyringe";
import chalk from "chalk";
import { Logger } from "./Logger";

@singleton()
export class LocalLogger implements Logger {

  info(message: string): void {
    console.log(chalk.blue(message));
  }

  error(message: string): void {
    console.log(chalk.red(message));
  }

}
