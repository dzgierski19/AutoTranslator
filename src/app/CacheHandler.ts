import { PathLike } from "fs";
import { FileHandler } from "./FileHandler";
import crypto from "crypto";
import path from "path";
import { pathToHashHandler } from "./Paths";

class CacheHandler {
  constructor(private readonly fileHandler: FileHandler) {}

  async isDataAvailableInCache(
    path: PathLike,
    data: string
  ): Promise<string | void> {
    const file = await this.fileHandler.readFile(path);
    if (file.length === 0) {
      console.log("Empty Cache");
      return;
    }
    const parsedFile = JSON.parse(file);
    const parsedMap = parsedFile.map((element: string) => JSON.parse(element));
    return parsedMap.find((element: string) => {
      //   console.log(Object.keys(element)[0]);
      if (Object.keys(element)[0] === data) {
        return element;
      }
    });
  }

  async writeFile(path: PathLike, data: string) {
    const hashedData = this.hashData(data);
    const obj = { [`${hashedData}`]: data };
    const stringifyObj = JSON.stringify(obj);
    const hash = await this.isDataAvailableInCache(path, hashedData);

    if (hash) {
      return;
    }

    this.fileHandler.writeFile(path, stringifyObj);
  }

  readFile(path: PathLike) {
    this.fileHandler.readFile(path);
  }

  hashData(data: any): string {
    const stringify = JSON.stringify(data);
    return crypto.createHash("sha256").update(stringify).digest("hex");
  }
}

const newFileHandler = new FileHandler();

const newCache = new CacheHandler(newFileHandler);

async function main() {
  await newCache.writeFile(pathToHashHandler, "Hello");
  await newCache.writeFile(pathToHashHandler, "Goodbye");
  await newCache.writeFile(pathToHashHandler, "Hello");
  await newCache.writeFile(pathToHashHandler, "Hello");
}

main();
