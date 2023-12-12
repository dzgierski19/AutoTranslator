import fs from "fs";

const pathToJSON = `${__dirname}/../../data/translator.json`;

export interface IFileModifier {
  readJSONData(): Promise<string>;
  addDataToJSON(data: string): Promise<void>;
  isDataAvailableInJSON(data: string): Promise<string | void>;
}

export class FileModifier implements IFileModifier {
  readJSONData(): Promise<string> {
    return fs.promises.readFile(pathToJSON, {
      encoding: "utf-8",
    });
  }

  async addDataToJSON(data: string): Promise<void> {
    const dataIfInJSON = await this.isDataAvailableInJSON(data);
    if (dataIfInJSON) {
      console.log("already in database");
      return;
    }
    const readFile = await this.readJSONData();
    if (readFile.length === 0) {
      const stringifyData = JSON.stringify([data], null, 2);
      fs.promises.writeFile(pathToJSON, stringifyData);
      return;
    }
    const parsedJSON: string[] = JSON.parse(readFile);
    parsedJSON.push(data);
    const parsedJSONStringify = JSON.stringify(parsedJSON, null, 2);
    fs.promises.writeFile(pathToJSON, parsedJSONStringify);
  }

  //todo

  async method(data: string): Promise<string> {
    const readFile = await this.readJSONData();
    const parsedJSON: string[] = JSON.parse(readFile);
    parsedJSON.push(data);
    return JSON.stringify(parsedJSON, null, 2);
  }

  //todo

  async isDataAvailableInJSON(data: string): Promise<string | void> {
    const file = await this.readJSONData();
    if (file.length === 0) {
      console.log("Empty JSON file");
      return;
    }
    const parsedFile = JSON.parse(file);

    return parsedFile.find((element: string) => element === data);
  }
}

// const obj = { Hello: { Kosz: "nie", Piłka: "okrągła" } };
// const objString = JSON.stringify(obj, null, 2);

async function main() {
  const hello = new FileModifier();
  const answer = await hello.isDataAvailableInJSON("element");
  console.log(answer);
  await hello.addDataToJSON("element");
  // await hello.addDataToJSON("element2");
  // await hello.addDataToJSON("element2");
  // await hello.addDataToJSON("element3");
  // await hello.addDataToJSON("element3");
  await hello.readJSONData();
  const check = await hello.isDataAvailableInJSON("element");
  // const method = await hello.method(objString);
  // console.log(method);
  console.log(check);
  const JSONED = await hello.readJSONData();
  const parse = JSON.parse(JSONED);
  console.log(parse);
}

main();
