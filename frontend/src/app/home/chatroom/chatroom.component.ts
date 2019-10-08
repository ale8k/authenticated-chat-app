import { Component, OnInit } from "@angular/core";
import { SocketService } from "src/app/shared/services/socket.service";
import { SessionService } from "src/app/shared/services/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "chatroom",
  templateUrl: "./chatroom.component.html",
  styleUrls: ["./chatroom.component.scss"]
})
export class ChatroomComponent implements OnInit {

  constructor(
    private socketService: SocketService,
    private sessionService: SessionService,
    private route: Router
  ) { }


  ngOnInit() {
    this.socketService.connect();

    const socket = this.socketService.usersSocket;
    // When we connect, the server will send an auth request
    socket.on("auth req", () => {
      console.log("requesting auth");
      // To confirm our auth, we hit the session confirmation endpoint
      this.sessionService.loggedInConfirmation().subscribe(user => {
        if (user) {
          socket.emit("successful authentication", user);
        } else {
          socket.emit("unsuccessful authentication");
        }
      });
    });

  }

}
