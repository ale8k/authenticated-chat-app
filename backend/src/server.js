import express from "express";
import { PORT, NODE_ENV, MONGY_URI } from '../config';
import { userRoutes } from './routes/index';
import * as http from "http";
import io from "socket.io";
import mongoose from 'mongoose';

// #CONSTANT VARIABLES
const app = express();
const server = http.Server(app);
const socketIO = io(server);
const apiRouter = express.Router();

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRouter);

// #ROUTES
apiRouter.use('/users', userRoutes);

// #MONGY CONNECTION
mongoose.connect(MONGY_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("DB connection successful"));

// SocketIO connection
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