export interface MultipleChoiceQuestion {
  title: string;
  choices: readonly string[];
  answer: number;
}

export type QuestionResponse = { [key: string]: MultipleChoiceQuestion };
