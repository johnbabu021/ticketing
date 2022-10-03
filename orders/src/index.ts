import express from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import requireAuth from "@ticketsjohn/common/build/middleware/require-auth";
import { currentUserMiddleware, errorHanlder } from "@ticketsjohn/common";
import { natsWrapper } from "./nats-wrapper";
import { deleteRouter } from "./routes/delete";
import { IndexOrderRoute } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRoutes } from "./routes/show";
import { TicketCreatedListner } from "./events/listner/ticket-created-listner";
import { TicketUpdatedListner } from "./events/listner/ticket-updated-listner";
const app = express();
app.set("trust proxy", 1);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

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
  new TicketCreatedListner(natsWrapper.client).listen();
  new TicketUpdatedListner(natsWrapper.client).listen();
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

app.use(deleteRouter);
app.use(IndexOrderRoute);
app.use(newOrderRouter);
app.use(showOrderRoutes);
app.use(errorHanlder);

app.listen(3000, () => {
  console.log("app listening to port 3000");
  start();
});
