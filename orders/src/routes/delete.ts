import { Router, Request, Response } from "express";
import requireAuth from "@ticketsjohn/common/build/middleware/require-auth";
import { orderModal, OrderStatus } from "../model/order";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFound,
} from "@ticketsjohn/common";
import { OrderCancelledPublisher } from "../events/order-canceled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await orderModal.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new NotFound();
    }
    if (order.userId !== req.currentuser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    order.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: 0,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).json(order);
  }
);

export { router as deleteRouter };
