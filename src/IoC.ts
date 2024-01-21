import { FileHandler } from "./domains/files/FileHandler";
import { CacheHandler } from "./domains/Cache/CacheHandler";
import { Translator } from "./domains/translator/Translator";
import { TranslateController } from "./controllers/TranslateController";

const fileHandler = new FileHandler();
const cacheHandler = new CacheHandler(fileHandler);
const translator = new Translator(cacheHandler);

export const translateController = new TranslateController(translator);
