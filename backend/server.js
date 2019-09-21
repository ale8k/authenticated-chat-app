// Express
let express = require('express')
let app = express();

// Socket IO
let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);

// Remove server provider
app.disable("x-powered-by");

// Body parser
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parser
let cookieParser = require("cookie-parser");
app.use(cookieParser());

// Express session
let session = require("express-session");
let uuid = require("uuid/v4");

// This is shit, gonna use different auth idea!
app.use(session({
    genid: (req) => {
        return uuid(); 
    },
    secret: "my secret",
    resave: false,
    saveUninitialized: true
}))

// Mongoose / MongoDB
let mongy = require("mongoose");

mongy.connect("mongodb://localhost/chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
let login = require("./routes/login-routes");
app.use("/login", login);

// General variables
const port = process.env.PORT || 3000;

// SocketIO connection
io.on("connection", (socket) => {
    console.log('user connected');

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("chat message", (message) => {
        console.log(message);
    })

});

// HTTP Server
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});