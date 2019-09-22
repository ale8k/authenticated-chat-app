import express from "express";
import User from "../models/user";
import { SESS_NAME } from "../../config";

const sessionRouter = express.Router();