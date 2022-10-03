import { OrderCancelledEvent, Publisher, Subjects } from "@ticketsjohn/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrdersCancelled = Subjects.OrdersCancelled;
}
