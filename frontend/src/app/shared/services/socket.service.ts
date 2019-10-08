import { Injectable } from "@angular/core";
import io from "socket.io-client";
import { SessionService } from "./session.service";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  constructor() { }

  public get usersSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  public connect(): void {
    this.socket = io("http://localhost:5000");
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public sendMessage(userAndMessage): void {
    this.socket.emit("chat message", userAndMessage);
  }

}
