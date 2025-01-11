import { inject, injectable } from "tsyringe";
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ControllerInterface } from "entities/types/PluginInterface";
import { EventListener } from "utils/EventListener";
import { WebSocket } from 'ws';
import { AuthMiddleware } from "middlewares/AuthMiddleware";
import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

type ClientMapValue = {
  socket: WebSocket,
  listener: EventListener
}

@injectable()
export class WebSocketController implements ControllerInterface {

  constructor(
    @inject('EventListener') private readonly eventListener: EventListener,
    @inject('AuthMiddleware') private readonly authMiddleware: AuthMiddleware
  ) { }

  private clients = new Map<string, ClientMapValue>();

  webSocketHandler(socket: WebSocket, request: FastifyRequest) {
    const { id } = request.query as { id: string };

    const listener = this.eventListener.build()
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

  routes: FastifyPluginAsyncZod = async (app) => {
    app.addHook('onRequest', this.authMiddleware.build(['ADMIN']))
    app.route({
      schema: {
        security: [{ BearerAuth: [] }],
      },
      method: 'GET',
      url: '/location',
      handler: () => { },
      wsHandler: (...params) => this.webSocketHandler(...params)
    })
  }

}
