import {
  BadRequestError,
  NotFound,
  OrderStatus,
  validateMiddleware,
} from "@ticketsjohn/common";
import requireAuth from "@ticketsjohn/common/build/middleware/require-auth";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { OrderCreatedPublisher } from "../events/order-created-publiser";
import { orderModal } from "../model/order";
import { Ticket } from "../model/ticket";
import { natsWrapper } from "../nats-wrapper";
const router = Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
  "/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("ticketId must be provided"),
  ],
  validateMiddleware,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFound();
    }
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    const order = new orderModal({
      userId: req.currentuser!.id,
      status: OrderStatus.Created,
      version: 0,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      version: order.version,
      userId: order.userId,
      expiredAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).json(order);
  }
);

export { router as newOrderRouter };
