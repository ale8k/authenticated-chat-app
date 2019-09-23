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

    const { email, password } = req.body
    const user = await User.findOne({ email });

    if (user && user.comparePasswords(password)) {
      const sessionUser = userSession(user);
      req.session.user = sessionUser;
      res.send(sessionUser);
    } else {
      throw new Error('Invalid login credentials');
    }
  } catch (err) {
    res.status(401).send(parseError(err));
  }
});

// #LOGOUT
sessionRouter.delete("", (req, res) => {
  try {
    const user = session.user;
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
    res.status(422).send(parseError(err));
  }
});

// #LOGGEDIN
sessionRouter.get("", (req, res) => {
  res.send(req.session.user);
});

export default sessionRouter;