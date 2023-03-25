import { openai } from "@/config";
import { answersState, examState } from "@/state";
import { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "@/types";
import { formatMultipleChoiceQuestion } from "@/utils";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";

export function ExamForm() {
  const setAnswers = useSetRecoilState(answersState);
  const [exam, setExam] = useRecoilState(examState);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(true);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>();
  const [examName, setExamName] = useState<string>();
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<
    MultipleChoiceQuestionType[]
  >([]);

  useEffect(() => {
    if (exam) {
      setNumberOfQuestions(exam.numberOfQuestions);
      setExamName(exam.name ?? "");
      setMultipleChoiceQuestions(exam.multipleChoiceQuestions ?? []);
    }
  }, [exam]);

  const handleGenerateExam = async () => {
    try {
      setLoading(true);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a random multiple choice exam for ${examName} with ${numberOfQuestions} questions providing all the choices with the correct answer at the end and each section having the header Question, Choices, Answer and the exact word NextQuestion`,
        max_tokens: 4000,
      });
      const [choice] = response.data.choices;
      if (choice.text) {
        const questions = choice.text.split("NextQuestion");
        const multipleChoiceQuestions = questions
          .filter((txt) => txt)
          .map(formatMultipleChoiceQuestion);
        setAnswers({});
        setExam({
          name: examName ?? "",
          numberOfQuestions: numberOfQuestions ?? 0,
          multipleChoiceQuestions,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel>Number of Questions</FormLabel>
        <Input
          type={"number"}
          value={numberOfQuestions}
          onChange={(e) =>
            setNumberOfQuestions(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Exam</FormLabel>
        <Input value={examName} onChange={(e) => setExamName(e.target.value)} />
      </FormControl>
      <Button isLoading={loading} onClick={handleGenerateExam}>
        Generate Practice Exam
      </Button>
      <VStack>
        {multipleChoiceQuestions.map((multipleChoiceQuestion, i) => (
          <MultipleChoiceQuestion
            key={i}
            questionNumber={i + 1}
            multipleChoiceQuestion={multipleChoiceQuestion}
            showAnswers={showAnswers}
          />
        ))}
        <Button onClick={() => setShowAnswers(!showAnswers)}>
          {showAnswers ? "Hide Answers" : "Show Answers"}
        </Button>
      </VStack>
    </>
  );
}
