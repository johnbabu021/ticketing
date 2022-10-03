import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
  TicketUpdated,
} from "@ticketsjohn/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
