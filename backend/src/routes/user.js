import express from 'express';
import User from '../models/user';

const userRouter = express.Router();

/**
 * Turn this into middleware at somepoint!
 * Getting lazy Alex... :D
 * Also probably extend this to add socket.io info for us
 */
function userSession(user) {
    return {
        userId: user._id,
        username: user.username
    }
}

/**
 * Write validation middleware, check for:
 * email, confirm it is an email.
 * username, x amount of characters.
 * password, Capital, numbers characters etc.
 */
userRouter.post("/", (req, res) => {
    try {
        const { username, email, password } = req.body

        const newUser = new User({ username, email, password });
        const sessionUser = userSession(newUser);
        newUser.save();

        req.session.user = sessionUser;
        res.send(sessionUser);

    } catch (err) {
        res.status(400).send(err);
    }
});

/**
 * #DEBUG
 */
userRouter.get("/", (req, res) => {
    User.find({}, (err, users) => {
        res.send(users);
    });
});

export default userRouter;