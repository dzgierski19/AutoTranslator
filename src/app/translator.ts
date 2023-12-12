const { Translate } = require("@google-cloud/translate").v2;
import "dotenv/config";
import fs from "fs";
import { FileModifier } from "./fileModifier";
import { LANGUAGES } from "./TranslatorType";

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
    return JSON.stringify(file, null, 2);
  };

  translateText = async (
    text: string | object,
    targetLanguage: string
  ): Promise<void> => {
    if (typeof text === "object") {
      return this.translateObject(text, targetLanguage);
    }
    await this.isDataAvailableInJSON(text);
    const data = await this.stringifyData(text, targetLanguage);
    console.log(data);
    await this.addDataToJSON(data);
  };

  private translateObject = async (
    data: Object,
    language: string
  ): Promise<void> => {
    const objValues = Object.values(data);
    for (const value of objValues) {
      if (typeof value === "object") {
        console.log(`${value}`);
        await this.translateObject(value, language);
        return;
      }
      if (typeof value === "number") {
        // const number = value.toString();
        // await this.translateText(number, language);
      } else await this.translateText(value, language);
    }
    return;
  };
}

const HarryKane = {
  pozycja: "napastnik",
  informacje: {
    narodowość: 16,
    statystyki: {
      ilość_bramek: "szesnaście",
      lepsza_noga: "prawa",
    },
  },
};

const RonaldinhoGaucho = {
  pozycja: "pomocnik",
  informacje: {
    narodowość: 16,
    statystyki: {
      ilość_bramek: "szesnaście",
      lepsza_noga: "lewa",
    },
  },
};

const arr = ["pozycja", "atakujący", "ulotka", "powtórka", "ulotka"];

// błąd gdy za ilość_bramek wstawię liczbę, ignoruję rowniez kolejny klucz

async function main() {
  const translator = new Translator();
  // await translator.translateText("hello", LANGUAGES.ENGLISH);
  // await translator.translateText("hello", LANGUAGES.FRENCH);
  // await translator.translateText("trawa", LANGUAGES.FRENCH);
  // await translator.translateText("hello", LANGUAGES.POLISH);
  // await translator.translateText("hello", LANGUAGES.POLISH);
  await translator.translateText(HarryKane, LANGUAGES.ENGLISH);
  await translator.translateText(RonaldinhoGaucho, LANGUAGES.ENGLISH);
  await translator.translateText(arr, LANGUAGES.ENGLISH);
}

main();

// klucze zostawiamy w oryginalnym jezyku
