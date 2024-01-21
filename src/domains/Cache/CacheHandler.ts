import { PathLike } from "fs";
import crypto from "crypto";
import { FileHandler } from "../files/FileHandler";

export class CacheHandler {
  constructor(private readonly fileHandler: FileHandler) {}

  private readonly CACHE_FILE_NAME = process.env.CACHE_FILE_NAME;

  async isHashAvailableInCache(
    path: PathLike,
    hash: string
  ): Promise<string | void> {
    const file = await this.fileHandler.readFile(path);
    if (!file.length) {
      console.log("Empty Cache");
      return;
    }
    const parsedFile = JSON.parse(file);
    if (parsedFile[hash]) {
      return hash;
    }
  }

  async writeFile(path: PathLike, data: string) {
    const hashedData = this.hashData(data);
    const isHashAvailable = await this.isHashAvailableInCache(path, hashedData);
    if (isHashAvailable) {
      return;
    }
    this.fileHandler.writeFile(path, hashedData, data);
  }

  hashData(data: any): string {
    const stringify = JSON.stringify(data);
    return crypto.createHash("sha256").update(stringify).digest("hex");
  }
}
