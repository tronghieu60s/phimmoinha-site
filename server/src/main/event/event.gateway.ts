import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PingUserSectionInput } from '../user/user.entity';
import { EventService } from './event.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventGateway {
  constructor(private service: EventService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ping')
  async ping(@ConnectedSocket() client: Socket, @MessageBody() input: PingUserSectionInput) {
    const pingData = {
      ...input,
      Ip: client.handshake.address,
      Origin: client.handshake.headers.origin,
      UserAgent: client.handshake.headers['user-agent'],
      Socket_Id: client.id,
    };
    client.on('disconnect', async () => this.service.disconnect(this.server, pingData));
    return this.service.ping(this.server, pingData);
  }
}
