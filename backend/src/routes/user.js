//import Joi from '@hapi/joi';
import express from 'express';
import User from '../models/user';
//import { signUp } from '../validations/user';

const userRouter = express.Router();

/**
 * Write validation middleware, check for:
 * email, confirm it is an email.
 * username, x amount of characters.
 * password, Capital, numbers characters etc.
 */
userRouter.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.send({ userId: newUser.id, username: username });
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