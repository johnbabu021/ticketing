import { Listner, OrderCreatedEvent, Subjects } from "@ticketsjohn/common";
import { Message } from "node-nats-streaming";
export class OrderCreatedListner extends Listner<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "order:created";
  onMessage: (data: OrderCreatedEvent["data"], msg: Message) => {};
}
