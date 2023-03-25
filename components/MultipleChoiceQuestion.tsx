import { answersState } from "@/state";
import { MultipleChoiceQuestion } from "@/types";
import {
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState } from "recoil";

interface Props {
  questionNumber: number;
  multipleChoiceQuestion: MultipleChoiceQuestion;
  showAnswers: boolean;
}

export function MultipleChoiceQuestion({
  questionNumber,
  multipleChoiceQuestion,
  showAnswers,
}: Props) {
  const [answers, setAnswers] = useRecoilState(answersState);
  const { title, choices, answer } = multipleChoiceQuestion;
  const [selectedChoice, setSelectedChoice] = useState(
    answers[questionNumber] !== undefined
      ? choices[answers[questionNumber]]
      : ""
  );

  return (
    <Card w="700px">
      <CardHeader fontWeight={"bold"}>{title}</CardHeader>
      <CardBody>
        <RadioGroup
          value={selectedChoice}
          onChange={(val) => {
            setSelectedChoice(val);
            setAnswers({
              ...answers,
              [questionNumber]: choices.findIndex((choice) => choice === val),
            });
          }}
        >
          <Stack>
            {choices?.map((choice, i) => (
              <Radio key={choice} value={choice}>
                <Text
                  textColor={
                    showAnswers &&
                    (selectedChoice === choice || choices[answer] === choice)
                      ? choices[answer] === choice
                        ? "green"
                        : "red"
                      : undefined
                  }
                >
                  {choice}
                </Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </CardBody>
    </Card>
  );
}
