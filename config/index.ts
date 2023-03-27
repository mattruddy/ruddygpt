import { Configuration, OpenAIApi } from "openai";

const openAIConfig = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const openai = new OpenAIApi(openAIConfig);

export interface examPromptForJsonArgs {
  examName: string;
  numberOfQuestions: number;
}

export const examPromptForJson = ({
  examName,
  numberOfQuestions,
}: examPromptForJsonArgs) =>
  `Create a random multiple choice exam for ${examName} exam with ${numberOfQuestions} questions providing the "title" and all the "choices" with the "answer" as the index of "choices". output this as a raw json array of objects with properties title, choices and answer.`;
