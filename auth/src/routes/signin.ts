import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  BadRequestError,
  RequestValidationError,
  validateMiddleware,
} from "@ticketsjohn/common";
import { User } from "../models/usermodesl";
import jwt from "jsonwebtoken";
import { Password } from "../service/password";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("email is necessary"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password must not be empty"),
  ],
  validateMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      throw new BadRequestError("invalid user credentials");
    }
    const userPasswordsMatch = await Password.compare(
      userExist.password,
      password
    );
    if (!userPasswordsMatch) {
      throw new BadRequestError("invalid user credentials");
    }
    const userJwt = jwt.sign(
      {
        id: userExist._id,
        email: userExist.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJwt,
    };
    // req.cookies.session = {
    //   jwt: userJwt,
    // };
    res.status(200).json(userExist);
  }
);

export { router as singInRouter };
