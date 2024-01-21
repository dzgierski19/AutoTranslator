import { Router } from "express";
import { translateController } from "../IoC";
export const translateRouter = Router();

translateRouter.post("/translate", translateController.translateData);
translateRouter.get("/translate", translateController.getData);
