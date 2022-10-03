import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "@ticketsjohn/common";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
}); //aka client

stan.on("connect", () => {
  console.log("publisher connected to NATS");
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({
    id: "123",
    title: "HELLO WOLRD BY TYPESCTIPT",
    price: 20,
  });
  // const data = JSON.stringify({
  //   id: "124",
  //   title: "HELLO WORLD",
  //   price: 20,
  // });
  // stan.publish("tickets:created", data, () => {
  //   console.log("Event published");
  // });
});
