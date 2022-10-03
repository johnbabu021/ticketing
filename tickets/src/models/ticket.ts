import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface ticketAttrs {
  title: string;
  price: number;
  userId: string;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
}
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: ticketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: ticketAttrs) => {
  return new Ticket(attrs);
};
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<ticketAttrs, TicketModel>(
  "tickets",
  ticketSchema
);

export default Ticket;
