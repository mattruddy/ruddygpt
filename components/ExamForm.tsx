import { openai } from "@/config";
import { answersState, examState } from "@/state";
import {
  MultipleChoiceQuestion as MultipleChoiceQuestionType,
  QuestionResponse,
} from "@/types";
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
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a random multiple choice exam for ${examName} exam with ${numberOfQuestions} questions providing the "title" and all the "choices" with the  "answer" as the index of "choices". output this as raw json format with the question number as the key and an object with properties title, choices and answer as the value.`,
        max_tokens: 4000,
      });
      const jsonResponse = JSON.parse(
        response.data.choices[0].text?.replace("\n", "") ?? "{}"
      ) as QuestionResponse;
      const questions = Object.values(jsonResponse);
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
