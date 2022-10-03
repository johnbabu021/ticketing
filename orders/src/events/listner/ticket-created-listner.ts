import { Listner, Subjects, TicketCreatedEvent } from "@ticketsjohn/common";
import { Ticket } from "../../model/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
