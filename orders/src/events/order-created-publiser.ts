import { OrderCreatedEvent, Publisher, Subjects } from "@ticketsjohn/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
