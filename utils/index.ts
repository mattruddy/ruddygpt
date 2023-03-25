import { MultipleChoiceQuestion } from "@/types";

export function formatMultipleChoiceQuestion(
  text: string
): MultipleChoiceQuestion {
  const splitText = text.split("Choices:");
  const [question, choicesAndAnswer] = splitText;
  const [choices, answer] = choicesAndAnswer.split("Answer:");
  return {
    question,
    choices: choices.split("\n").filter((choice) => choice.trim()),
    answer,
  };
}
