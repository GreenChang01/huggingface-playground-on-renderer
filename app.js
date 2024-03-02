import { createRequire } from "node:module";
import { client } from "./client.js";
import express from "express";
import bodyParser from "body-parser";
const require = createRequire(import.meta.url);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
global.EventSource = require("eventsource");
const baseUrl =
  "https://playgroundai-playground-v2-5.hf.space/--replicas/9kuov/";
const huggingFaceApp = await client(baseUrl);

const port = process.env.PORT || 3001;

const handleRunGenerateImage = async (req, res) => {
  console.log("req: ", req.body);
  const { posPrompt, negPrompt, useNeg, width, height, guidanceScale } =
    req.body;
  const result = await huggingFaceApp.predict("/run", [
    posPrompt || "Hello!!", // string  in 'Prompt' Textbox component
    negPrompt || "", // string  in 'Negative prompt' Textbox component
    useNeg || false, // boolean  in 'Use negative prompt' Checkbox component
    0, // number (numeric value between 0 and 2147483647) in 'Seed' Slider component
    width || 1024, // number (numeric value between 1024 and 1536) in 'Width' Slider component
    height || 1024, // number (numeric value between 1024 and 1536) in 'Height' Slider component
    guidanceScale || 3, // number (numeric value between 0.1 and 20) in 'Guidance Scale' Slider component
    true, // boolean  in 'Randomize seed' Checkbox component
  ]);
  if (result?.data?.[0]?.[0]?.image?.path) {
    const fileUrl = `${baseUrl}file=${result.data[0][0].image.path}`;
    console.log(fileUrl);
    res.status(200).json({ imgUrl: fileUrl });
  }
};

app.post("/", handleRunGenerateImage);

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
