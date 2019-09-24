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
socketIO.on("connection", (socket) => {
    console.log('user connected');

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("chat message", (message) => {
        console.log(message);
    })

});

server.listen(PORT, () => console.log(`started on port: ${PORT}`));