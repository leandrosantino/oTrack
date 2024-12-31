import Elysia from "elysia";
import { injectable } from "tsyringe";


@injectable()
export class AuthMiddleware {

  build(requestPermission: string) {
    return new Elysia()
      .derive({ as: 'global' }, ({ headers }) => {
        const auth = headers['authorization']
        return {
          bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
      })
      .get('/plugin', ({ bearer }) => bearer)
  }

}
