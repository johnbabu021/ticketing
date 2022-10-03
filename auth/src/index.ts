import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signOutRouter } from "./routes/signout";
import { singInRouter } from "./routes/signin";
import { singUpRouter } from "./routes/signup";
import { errorHanlder } from "@ticketsjohn/common";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
const app = express();
app.set("trust proxy", 1); // trust first proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(signOutRouter);
app.use(singInRouter);
app.use(singUpRouter);
app.use(currentUserRouter);
app.use(errorHanlder);

app.use((req, res) => {
  res.status(404).json("route not found");
});
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("no secret");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("no mongo secret");
  }
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
app.listen(3000, () => {
  console.log("app listening to port 3000 !!!!");
  start();
});
