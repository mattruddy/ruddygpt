export interface examPromptForJsonArgs {
  examName: string;
  numberOfQuestions: number;
}

export const examPromptForJson = ({
  examName,
  numberOfQuestions,
}: examPromptForJsonArgs) =>
  `Create a random multiple choice practice exam to help study for an exam on ${examName}. Generate ${numberOfQuestions} questions. respond in the format: [{"title": string, "choices": string[], "answer": number }]`;
