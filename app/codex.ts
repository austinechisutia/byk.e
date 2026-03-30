import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runCodex() {
  const prompt = "Write a TypeScript function that reverses a string";

  const response = await openai.responses.create({
    model: "code-davinci-002",
    input: prompt,
  });

  console.log(response.output_text);
}

runCodex();