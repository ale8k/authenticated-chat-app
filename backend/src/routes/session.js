import express from "express";
import User from "../models/user";
import { SESS_NAME } from "../../config";

const sessionRouter = express.Router();

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

// #LOGIN
sessionRouter.post("", async (req, res) => {
  try {
    console.log("User attempting to login...");
    const { email, password } = req.body
    console.log(req.body)
    const user = await User.findOne({ email });

    if (user && user.comparePasswords(password)) {
      const sessionUser = userSession(user);
      req.session.user = sessionUser;
      res.send(sessionUser);
    } else {
      throw new Error('Invalid login details...');
    }
  } catch (err) {
    res.sendStatus(401);
  }
});

// #LOGOUT
sessionRouter.delete("", (req, res) => {
  try {
    const user = req.session.user;
    if (user) {
      req.session.destroy(err => {
        if (err) throw (err);
        res.clearCookie(SESS_NAME);
        res.send(user);
      });
    } else {
      throw new Error('Something went wrong');
    }
  } catch (err) {
    res.status(422).send(err);
  }
});

// #LOGGEDIN
sessionRouter.get("", (req, res) => {
  console.log(req.session.user);
  console.log("Is already logged in")
  res.send(req.session.user);
});

export default sessionRouter;