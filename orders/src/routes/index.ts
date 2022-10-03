import { Router, Request, Response } from "express";

const router = Router();

router.get("/orders", (req: Request, res: Response) => {
  res.status(200).json({});
});

export { router as IndexOrderRoute };
