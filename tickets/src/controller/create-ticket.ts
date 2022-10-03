import { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  TicketCreatedListner,
  TicketCreatedPublisher,
  validateMiddleware,
} from "@ticketsjohn/common";
import Ticket from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

export const createArr = [
  [
    body("title").not().isEmpty().withMessage("title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price is required and greater than 0"),
  ],
  validateMiddleware,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = new Ticket({
      title,
      price,
      userId: req.currentuser!.id,
    });
    await ticket.save();
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: req.currentuser!.id,
    });
    res.status(201).json(ticket);
  },
];

// const updateArr = [
//   body("title").not().isEmpty().withMessage("title is required"),
//   body("price")
//     .isFloat({ gt: 0 })
//     .withMessage("price is required and greater than 0"),
// ];
