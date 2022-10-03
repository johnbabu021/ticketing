import { Publisher, Subjects, TicketCreatedEvent, } from "@ticketsjohn/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated=Subjects.TicketCreated;



}