import { Logger } from "interfaces/Logger";
import { injectable, singleton } from "tsyringe";
import chalk from "chalk";

@injectable()
export class LocalLogger implements Logger {

  info(message: string): void {
    console.log(chalk.blue(message));
  }

  error(message: string): void {
    console.log(chalk.red(message));
  }

}
