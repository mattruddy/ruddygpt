import { examPromptForJson, openai } from "@/config";
import { MultipleChoiceQuestion, QuestionResponse } from "@/types";
import { APIResponse, ExamPayload } from "@/types/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<MultipleChoiceQuestion[]>>
) {
  const { examName, numberOfQuestions } = JSON.parse(req.body) as ExamPayload;
  console.log(req.body.examName);
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: examPromptForJson({
            numberOfQuestions: numberOfQuestions ?? 0,
            examName: examName ?? "",
          }),
        },
      ],
      max_tokens: 4_000,
    });
    const content = response.data.choices[0].message?.content;
    console.log(content);
    const jsonResponse = JSON.parse(
      content?.replace(/\n/g, "") ?? "{}"
    ) as MultipleChoiceQuestion[];
    res.status(200).json({
      error: false,
      message: "Success",
      data: jsonResponse,
    } as APIResponse<MultipleChoiceQuestion[]>);
  } catch (error) {
    console.error((error as any).message);
    res.status(500).json({
      error: true,
      message: (error as Error).message,
      data: [],
    });
  }
}
