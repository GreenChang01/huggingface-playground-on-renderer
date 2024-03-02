const express = require("express");
const { client } = require("@gradio/client")
const app = express();
const port = process.env.PORT || 3001;

const huggingFaceApp = client("https://playgroundai-playground-v2-5.hf.space/--replicas/9kuov/");
const handleRunGenerateImage = async (req, res) => {
  const { posPrompt,negPrompt,useNeg,width,height, guidanceScale } = req.body
  const result = await huggingFaceApp.predict("/run", [		
    posPrompt || "Hello!!", // string  in 'Prompt' Textbox component		
    negPrompt || "Hello!!", // string  in 'Negative prompt' Textbox component		
    useNeg || true, // boolean  in 'Use negative prompt' Checkbox component		
    0, // number (numeric value between 0 and 2147483647) in 'Seed' Slider component		
    width || 256, // number (numeric value between 256 and 1536) in 'Width' Slider component		
    height || 256, // number (numeric value between 256 and 1536) in 'Height' Slider component		
    guidanceScale || 0.1, // number (numeric value between 0.1 and 20) in 'Guidance Scale' Slider component		
    true, // boolean  in 'Randomize seed' Checkbox component
  ]);
  console.log(result.data);
}


app.post("/", handleRunGenerateImage);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;


