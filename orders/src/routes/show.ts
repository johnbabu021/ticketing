import { Router, Request, Response } from "express";
import requireAuth from "@ticketsjohn/common/build/middleware/require-auth";
import { orderModal } from "../model/order";
import { NotAuthorizedError, NotFound } from "@ticketsjohn/common";
const router = Router();

router.get("/orders/:id", requireAuth, async (req: Request, res: Response) => {
  const order = await orderModal.findById(req.params.id).populate("ticket");
  if (!order) {
    throw new NotFound();
  }
  if (order.userId !== req.currentuser!.id) {
    throw new NotAuthorizedError();
  }
  res.status(200).json({});
});

export { router as showOrderRoutes };
