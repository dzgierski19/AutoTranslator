import "dotenv/config";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.get("/ping", function (req: Request, res: Response) {
  res.send("Pong");
});

app.post("/translator", (req: Request, res: Response) => {
  const requestData = req.body;
  res.json({ message: "Received POST request", data: requestData });
  console.log("Hello Post Request");
});

const projectID = process.env.GOOGLE_TRANSLATE_PROJECT_ID;
console.log(projectID);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;
