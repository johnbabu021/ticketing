import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import requireAuth from "@ticketsjohn/common/build/middleware/require-auth";
import { CreateRoute } from "./routes/routes";
import { currentUserMiddleware, errorHanlder } from "@ticketsjohn/common";
import { natsWrapper } from "./nats-wrapper";
const app = express();
app.set("trust proxy", 1);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use("/api/tickets", currentUserMiddleware, requireAuth, CreateRoute);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("no secret");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("no mongo secret");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("no cluster id");
  }
  if (!process.env.NATS_URL) {
    throw new Error("no nats url");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("no client id");
  }
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );
  natsWrapper.client.on("close", () => {
    process.exit();
  });
  process.on("SIGINT", () => {
    natsWrapper.client.close();
  });
  process.on("SIGTERM", () => {
    natsWrapper.client.close();
  });
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
app.use(errorHanlder);

app.listen(3000, () => {
  console.log("app listening to port 3000");
  start();
});
