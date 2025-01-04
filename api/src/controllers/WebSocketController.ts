import Elysia from "elysia";
import { inject, injectable } from "tsyringe";
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ControllerInterface } from "./interfaces/ControllerInterface";
import { EventListener } from "utils/EventListener";
import { WebSocket } from 'ws';


type ClientMapValue = {
  socket: WebSocket,
  listener: EventListener
}


@injectable()
export class WebSocketController implements ControllerInterface {

  constructor(
    @inject('EventListener') private readonly eventListener: EventListener
  ) { }

  private clients = new Map<string, ClientMapValue>();

  plugin: FastifyPluginAsync = async (fastify) => {
    fastify.route({
      method: 'GET',
      url: '/ws',
      handler: () => { },
      wsHandler: (socket, req) => {
        const { id } = req.query as { id: string };

        const listener = this.eventListener.newInstance()
        this.clients.set(id, { socket, listener })


        listener.on('subscribe', (targetId: string) => {
          const targetSocket = this.clients.get(targetId)
          if (!targetSocket) {
            socket.send('Erro - Usuário não encontrado ou desconectado');
            return
          }
          targetSocket.listener.on('locationUpdate', (location: string) => {
            const locationParsed = JSON.stringify({
              event: 'locationSender',
              payload: { targetId, location }
            })
            socket.send(locationParsed)
          });
        })


        socket.on('message', (chunk) => {
          try {
            const data = JSON.parse(chunk.toString())
            const { event, payload } = this.eventListener.eventDataSchema.parse(data)
            listener.emit(event, payload)
          } catch { }
        })

        socket.on('close', () => {
          console.log('Client closed')
          this.clients.delete(id)
        })
      }
    })
  }

}
