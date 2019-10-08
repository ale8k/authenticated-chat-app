import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { SocketService } from "src/app/shared/services/socket.service";
import { SessionService } from "src/app/shared/services/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "chatroom",
  templateUrl: "./chatroom.component.html",
  styleUrls: ["./chatroom.component.scss"]
})
export class ChatroomComponent implements OnInit {

  @ViewChild("textInput", { static: false }) private textElement: ElementRef;
  public currentMessageList = [];

  constructor(
    private socketService: SocketService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    // We can't get here without route auth anyway...
    this.socketService.connect();
    this.socketService.usersSocket.on("new message", ({ user, message }) => {
      this.currentMessageList.push(user + ": " + message);
    });
  }

  public sendUserMessage(): void {
    this.socketService.sendMessage({
      user: this.sessionService.currentUser.username,
      message: this.textElement.nativeElement.value
    });
    this.textElement.nativeElement.value = "";
  }

}
