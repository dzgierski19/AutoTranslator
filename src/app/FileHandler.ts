import fs, { PathLike } from "fs";

export interface IFileHandler {
  readFile(path: PathLike): Promise<string>;
  writeFile(path: PathLike, data: string): Promise<void>;
}

export class FileHandler implements IFileHandler {
  readFile(path: PathLike): Promise<string> {
    return fs.promises.readFile(path, {
      encoding: "utf-8",
    });
  }

  async writeFile(path: PathLike, data: string): Promise<void> {
    const readFile = await this.readFile(path);
    if (readFile.length === 0) {
      const arrData = [data];
      const stringify = JSON.stringify(arrData);
      fs.promises.writeFile(path, stringify);
      return;
    }
    const parsedJSON = JSON.parse(readFile);
    parsedJSON.push(data);
    const parsedJSONStringify = JSON.stringify(parsedJSON, null, 2);
    fs.promises.writeFile(path, parsedJSONStringify);
  }
}
