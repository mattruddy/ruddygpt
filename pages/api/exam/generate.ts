import { examPromptForJson, openai } from "@/config";
import { MultipleChoiceQuestion, QuestionResponse } from "@/types";
import { ExamPayload } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MultipleChoiceQuestion[]>
) {
  const {
    body: { examName, numberOfQuestions },
  }: { body: ExamPayload } = req;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: examPromptForJson({
      numberOfQuestions: numberOfQuestions ?? 0,
      examName: examName ?? "",
    }),
    max_tokens: 4000,
  });
  const jsonResponse = JSON.parse(
    response.data.choices[0].text?.replace(/\n/g, "") ?? "{}"
  ) as MultipleChoiceQuestion[];
  res.status(200).json(jsonResponse);
}
