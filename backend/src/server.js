import express from "express";
import { PORT, NODE_ENV, MONGY_URI, SESS_LIFETIME, SESS_NAME, SESS_SECRET } from '../config';
import { userRoutes, sessionRoutes } from './routes/index';
import * as http from "http";
import io from "socket.io";
import mongoose from 'mongoose';
import session from "express-session";
import connectStore from "connect-mongo";
import cors from "cors";

// #CONSTANT VARIABLES
const app = express();
const server = http.Server(app);
const socketIO = io(server);
const apiRouter = express.Router();
const MongyStore = connectStore(session);

app.disable("x-powered-by");
app.use(cors({
    origin: [
        "http://localhost:4200"
    ],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// #MONGY CONNECTION
mongoose.connect(MONGY_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("DB connection successful"));

// #SESSION STORE CONNECT-MONGY
// Remember to check loginAttempts, probably add capacha & watch the IPAddress for login attempts
app.use(session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongyStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: parseInt(SESS_LIFETIME) / 1000
    }),
    cookie: {
        //sameSite: true,
        secure: NODE_ENV === 'production',
        maxAge: parseInt(SESS_LIFETIME)
    }
}));


// #ROUTES
app.use('/api', apiRouter);
apiRouter.use('/users', userRoutes);
apiRouter.use('/session', sessionRoutes);

// #SOCKETIO

// need to figure a way to project this socket somehow
socketIO.use((socket, next) => {
    next();
});

socketIO.on("connection", (socket) => {

    // DEBUG, lets us just check our packet data, save us console logging everywhere
    socket.use((packet, next) => {
        console.log(packet);
        next();
    })

    socket.on("user logged out", (user) => {
        console.log(user);
        socket.broadcast.emit("logged out", user.username)
    })

    socket.on("user logged in", (user) => {
        console.log(user);
        socket.broadcast.emit("logged in", user.username)
    })

    // Need to add disconnect log out message... (pull it from the packet and store in request object)
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("chat message", (userAndMessage) => {
        // Send message back to initial sender
        socket.emit("new message", userAndMessage);
        // Send message to all currently connected
        socket.broadcast.emit("new message", userAndMessage);
    })

});

server.listen(PORT, () => console.log(`started on port: ${PORT}`));