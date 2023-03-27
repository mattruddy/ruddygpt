import { examPromptForJson, openai } from "@/config";

// ...

import { answersState, examState } from "@/state";
import {
  MultipleChoiceQuestion as MultipleChoiceQuestionType,
  QuestionResponse,
} from "@/types";
import { ExamPayload } from "@/types/api";
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
import { MultipleChoiceQuestion as Question } from "./../types";

export function ExamForm() {
  const setAnswers = useSetRecoilState(answersState);
  const [exam, setExam] = useRecoilState(examState);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
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
      const response = await fetch("/api/exam/generate", {
        method: "POST",
        body: JSON.stringify({
          examName,
          numberOfQuestions,
        } as ExamPayload),
      });

      const data = (await response.json()) as Question[];
      const questions = Object.values(data);
      setMultipleChoiceQuestions(questions);
      setExam({
        numberOfQuestions: numberOfQuestions ?? 0,
        multipleChoiceQuestions: questions,
        name: examName ?? "",
      });
    } finally {
      setLoading(false);
      setAnswers({});
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
