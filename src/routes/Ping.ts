import { Router, Request, Response } from "express";

export const pingRouter = Router();

pingRouter.get(
  "/ping",
  (req, res, next) => {
    console.log("elo"), next();
  },
  (req, res, next) => {
    console.log("siema"), next();
  },
  function (req: Request, res: Response) {
    res.send("Pong");
  }
);

// utworzyc map na potrzeby testowania
// nagrywac req do zew api albo zamockowac
// super test
