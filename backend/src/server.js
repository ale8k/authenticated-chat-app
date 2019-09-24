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

// #CORS MIDDLEWARE
// TO BE ADDED.

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
        // Time to live, connect-mongo uses seconds not milliseconds,
        // so we divide by 1k :). We parseint as env variables can often
        // be set to strings...
        // This is is the TTL collection feature,
        // after mongod 2.2+ TTL feature recognises expired session, it will remove it. GOOD SHIT!
        // Also remember must run the DB in admin, else won't work.
        ttl: parseInt(SESS_LIFETIME) / 1000
    }),
    cookie: {
        //sameSite: true,
        secure: NODE_ENV === 'production',
        maxAge: parseInt(SESS_LIFETIME)
    }
}));


// #ROUTES

// This little mother fucker needs to be placed in the middleware cycle
// after the session, otherwise it's never picked up. Jesus christ I spent a good 30 minutes
// fannying around!!
app.use('/api', apiRouter);
// Create user
apiRouter.use('/users', userRoutes);
// Begin/End/Confirm a session routes
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