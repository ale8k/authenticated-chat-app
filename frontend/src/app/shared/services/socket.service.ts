import { Injectable } from "@angular/core";
import io from "socket.io-client";

@Injectable({
  providedIn: "root"
})
export class SocketService {

  constructor() { }

  private socket: SocketIOClient.Socket;

  public connect(): void {
    this.socket = io("http://localhost:3000");
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public sendMessage(): void {
    this.socket.emit("chat message", "harded coded value bitch");
  }

}
