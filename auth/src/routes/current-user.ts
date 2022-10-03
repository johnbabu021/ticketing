import express from "express";
import jwt from "jsonwebtoken";

import { currentUserMiddleware } from "@ticketsjohn/common";
const router = express.Router();

router.get("/api/users/currentuser", currentUserMiddleware, (req, res) => {
  res.status(200).json({ currentUser: req.currentuser || null });
});

export { router as currentUserRouter };
