// class TranslateController

import { ZodError } from "zod";
import { pathToTranslator } from "../domains/translator/Paths";
import { postTranslateSchema } from "../domains/translator/schemas/PostTranslateSchema";
import { Response, Request } from "express";
import { ITranslator } from "../domains/translator/Translator";

export class TranslateController {
  constructor(public readonly translator: ITranslator) {}

  translateData = async (req: Request, res: Response) => {
    try {
      const { text, language } = postTranslateSchema.parse(req.body);

      const translatedText = await this.translator.translate(
        pathToTranslator,
        text,
        language
      );
      console.log(translatedText);
      res.json(translatedText);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error);
        return;
      }
      res.status(500).json({ error: "Internal server error" });
      console.error("Translation error:", error);
    }
  };

  getData = (req: Request, res: Response) => {
    res.send(req.body);
  };
}
// }

// export const translateController = new TranslateController();
