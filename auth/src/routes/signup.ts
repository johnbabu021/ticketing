import express, { json, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  validateMiddleware,
  RequestValidationError,
} from "@ticketsjohn/common";
// import "express-async-errors";
import jwt from "jsonwebtoken";

import { User } from "../models/usermodesl";
import { Password } from "../service/password";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Passwod must be between 4 and 20 characters"),
  ],
  validateMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    console.log("creating a user");

    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    console.log(userExist);
    if (userExist)
      res.status(400).json({ errors: [{ message: "user already in use" }] });
    else {
      const passHas = await Password.toHash(password);

      const user = new User({
        email,
        password: passHas,
      });
      user.save();

      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(200).json({ jwt: userJwt });
    }
    // throw new DatabaseConnectionError();
  }
);

export { router as singUpRouter };
