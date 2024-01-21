import fs, { PathLike } from "fs";

export interface IFileHandler {
  readFile(path: PathLike): Promise<string>;
  writeFile(path: PathLike, key: string, data: string): Promise<void>;
}

export class FileHandler implements IFileHandler {
  readFile(path: PathLike): Promise<string> {
    return fs.promises.readFile(path, {
      encoding: "utf-8",
    });
  }

  async writeFile(path: PathLike, key: string, data: string): Promise<void> {
    const readFile = await this.readFile(path);
    if (!readFile) {
      await this.writeFileIfEmpty(path, key, data);
      return;
    }
    const parsedJSON = JSON.parse(readFile);
    parsedJSON[key] = data;
    const parsedJSONStringify = JSON.stringify(parsedJSON, null, 2);
    fs.promises.writeFile(path, parsedJSONStringify);
  }

  private async writeFileIfEmpty(
    path: PathLike,
    key: string,
    data: string
  ): Promise<void> {
    const file = { [`${key}`]: data };
    console.log(file);
    const stringify = JSON.stringify(file);
    fs.promises.writeFile(path, stringify);
  }
}

// wydzielic na dwie funkcje
