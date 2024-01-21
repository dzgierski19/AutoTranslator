import "dotenv/config";
import express from "express";
// import { pingRouter } from "./routes/Ping";
import { translateRouter } from "./routes/TranslateRouter";

export const app = express();
const PORT = 3000;

app.use(express.json());

// app.use("/", pingRouter);
app.use("/", translateRouter);

export const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// zod
// midleware
// routing
// controlery i serwisy

//
//ioc container
// dodac container do instancji klas

// jo
