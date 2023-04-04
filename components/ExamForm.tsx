import { answersState, apiKeyState, examState } from "@/state";
import { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "@/types";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { MultipleChoiceQuestion as Question } from "./../types";
import { ExamPayload } from "@/types/api";

export function ExamForm() {
  const toast = useToast();
  const setAnswers = useSetRecoilState(answersState);
  const [exam, setExam] = useRecoilState(examState);
  const [apiKeyStore, setApiKeyStore] = useRecoilState(apiKeyState);
  const [loading, setLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>();
  const [examName, setExamName] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();
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

  useEffect(() => {
    setApiKey(apiKeyStore);
  }, [apiKeyStore]);

  const handleGenerateExam = async () => {
    try {
      setApiKeyStore(apiKey || "");
      setLoading(true);
      const response = await fetch("/api/exam/generate", {
        method: "POST",
        body: JSON.stringify({
          examName,
          numberOfQuestions,
          apiKey,
        } as ExamPayload),
      });
      if (response.status > 299) {
        const body = await response.json();
        toast({
          title: "Error",
          description: body.message,
          status: "error",
          isClosable: true,
        });
        return;
      }
      const data = (await response.json()).data as Question[];
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
        <FormLabel>OpenAI API Key</FormLabel>
        <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </FormControl>
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
