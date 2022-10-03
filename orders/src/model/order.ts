import mongoose from "mongoose";
import { OrderStatus } from "@ticketsjohn/common";
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderModel {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  version: { type: Number, required: true },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
});

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const orderModal = mongoose.model<OrderModel>("order", orderSchema);
export { OrderStatus };
