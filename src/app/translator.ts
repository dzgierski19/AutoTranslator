const { Translate } = require("@google-cloud/translate").v2;
import "dotenv/config";
import fs from "fs";
import { FileModifier } from "./fileModifier";

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS ?? "");

const pathToJSON = `${__dirname}/../../data/translator.json`;

type TranslatedType = {
  text: string;
  textLanguage: string;
  translatedText: string;
  translatedTextLanguage: string;
};

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.projectID,
});

interface ITranslator {
  detectLanguage(text: string): Promise<string | void>;
  stringifyData(text: string, targetLanguage: string): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<void>;
}

class Translator extends FileModifier {
  detectLanguage = async (text: string): Promise<string | void> => {
    try {
      let response = await translate.detect(text);
      //   console.log(response);
      return response[0].language;
    } catch (err) {}
  };

  stringifyData = async (
    text: string,
    targetLanguage: string
  ): Promise<string> => {
    const language = await this.detectLanguage(text);
    const [translation] = await translate.translate(text, targetLanguage);
    const file = {
      text: text,
      textLanguage: language,
      translatedText: translation,
      translatedTextLanguage: targetLanguage,
    };
    return JSON.stringify([file], null, 2);
  };

  translateText = async (
    text: string,
    targetLanguage: string
  ): Promise<void> => {
    await this.isDataAvailableInJSON(text);
    const data = await this.stringifyData(text, targetLanguage);
    await this.addDataToJSON(data);
  };
}

async function main() {
  const translator = new Translator();
  await translator.translateText("hello", "ru");
  await translator.translateText("hello", "ru");
  await translator.translateText("trawa", "tu");
  await translator.translateText("hello", "pl");
}

main();

// klucze zostawiamy w oryginalnym jezyku
