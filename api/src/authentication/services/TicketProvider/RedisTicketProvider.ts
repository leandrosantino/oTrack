import { singleton } from "tsyringe";
import { ExpiredTicket, InvalidTicket, TicketProvider } from "./TicketProvider";
import { createId } from "@paralleldrive/cuid2";
import { createClient, RedisJSON } from "redis";

@singleton()
export class RedisTicketProvider implements TicketProvider {

  private readonly KEY_PREFIX = 'ticket:'
  private readonly redisClient = createClient({
    password: properties.REDIS_PASSWORD,
  })

  async generate(payload: object, validityInMinutes: number): Promise<string> {
    await this.redisClient.connect()
    const ticket = createId()
    const key = this.KEY_PREFIX.concat(ticket)

    await this.redisClient.json.set(key, '$', payload as RedisJSON, { condition: 'NX' })
    await this.redisClient.expire(key, validityInMinutes * 60)

    this.redisClient.destroy()
    return ticket
  }

  async isValid(ticket: string): Promise<boolean> {
    await this.redisClient.connect()
    const key = this.KEY_PREFIX.concat(ticket)

    const exists = await this.redisClient.exists(key)
    const ttl = await this.redisClient.ttl(key)
    this.redisClient.destroy()

    return exists === 1 && ttl > 0
  }

  async use<T>(ticket: string): AsyncResult<T, InvalidTicket | ExpiredTicket> {
    await this.redisClient.connect()
    const key = this.KEY_PREFIX.concat(ticket)

    const exists = await this.redisClient.exists(key)
    if (exists === 0) {
      this.redisClient.destroy()
      return Err(new InvalidTicket())
    }

    const ticketData = await this.redisClient.json.get(key) as T
    const ttl = await this.redisClient.ttl(key)

    if (ttl <= 0) {
      this.redisClient.destroy()
      return Err(new ExpiredTicket())
    }

    await this.redisClient.json.del(key)
    this.redisClient.destroy()

    return Ok(ticketData)
  }

}
