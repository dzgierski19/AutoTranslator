const { Translate } = require("@google-cloud/translate").v2;
import "dotenv/config";
import { PathLike } from "fs";
import { LANGUAGES } from "./TranslatorType";
import { CacheHandler } from "../Cache/CacheHandler";
import { FileHandler } from "../files/FileHandler";
import { pathToTranslator } from "./Paths";

type TranslatedType = {
  text: string;
  textLanguage: string;
  translatedText: string;
  translatedTextLanguage: string;
};

export interface ITranslator {
  translate(
    path: PathLike,
    data: string | object,
    targetLanguage: string
  ): Promise<Record<string, string> | string>;
}

export class Translator implements ITranslator {
  constructor(private readonly cacheHandler: CacheHandler) {}

  private readonly CREDENTIALS = JSON.parse(process.env.CREDENTIALS ?? "");

  private readonly googleTranslate = new Translate({
    credentials: this.CREDENTIALS,
    projectId: this.CREDENTIALS.projectID,
  });

  translate = async (
    path: PathLike,
    data: string | object,
    targetLanguage: string
  ): Promise<Record<string, string> | string> => {
    if (typeof data === "object") {
      const translatedObject = await this.translateObject(
        path,
        data,
        targetLanguage
      );
      return translatedObject;
    }
    const translatedText = await this.translateText(path, data, targetLanguage);
    return translatedText;
  };

  private translateText = async (
    path: PathLike,
    data: string,
    targetLanguage: string
  ): Promise<string> => {
    // sprawdzenie czy zgadza się hash
    const file = await this.translateFile(data, targetLanguage);
    const { translatedText, textLanguage } = file;
    console.log(translatedText);
    await this.cacheHandler.writeFile(
      path,
      translatedText + ", " + textLanguage
    );
    return translatedText;
  };

  private translateObject = async (
    path: PathLike,
    data: Record<string, any>,
    targetLanguage: string
  ): Promise<Record<string, string>> => {
    for (const key in data) {
      const dataKey = data[key];
      if (typeof dataKey === "object") {
        const obj = await this.translateObject(path, dataKey, targetLanguage);
        data[key] = obj;
      } else {
        const text = await this.translateText(path, dataKey, targetLanguage);
        data[key] = text;
      }
    }
    return data;
  };

  private detectLanguage = async (text: string): Promise<string | void> => {
    try {
      let response = await this.googleTranslate.detect(text);
      //   console.log(response);
      return response[0].language;
    } catch (err) {}
  };

  private translateFile = async (text: string, targetLanguage: string) => {
    const language = await this.detectLanguage(text);
    const [translation] = await this.googleTranslate.translate(
      text,
      targetLanguage
    );
    const file = {
      text: text,
      textLanguage: language,
      translatedText: translation,
      translatedTextLanguage: targetLanguage,
    };
    return file;
  };
}

