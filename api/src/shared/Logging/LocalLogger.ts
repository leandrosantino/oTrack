import { injectable } from "tsyringe";
import chalk from "chalk";
import { Logger } from "./Logger";

@injectable()
export class LocalLogger implements Logger {

  info(message: string): void {
    console.log(chalk.blue(message));
  }

  error(message: string): void {
    console.log(chalk.red(message));
  }

}
