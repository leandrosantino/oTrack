import "reflect-metadata";

import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { authController } from "factory";

const app = new Elysia({ adapter: node() })
  .use(authController.build('/auth'))
  .listen(3000, ({ hostname, port }) => {
    console.log(
      `🦊 Elysia is running at ${hostname}:${port}`
    )
  })

export type App = typeof app
