import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log(socket.connected);
    });
  }

  // You can listen to this event
  // Client can send message to me by using the message key/event name
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody()
    data: any
  ): Observable<WsResponse<any>> {
    console.log('Message is received from the client');
    console.log(data); //Here we did not send a message back to the server
    return of({
      event: 'message',
      data: { msg: 'THIS IS THE MESSAGE FROM THE SERVER' },
    });
  }
}
