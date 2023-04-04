import { MultipleChoiceQuestion } from "@/types";
import { atom } from "recoil";
import { localStorageEffect } from "./utils";

type IMap = { [key: number]: number };

interface Exam {
  name: string;
  numberOfQuestions: number;
  multipleChoiceQuestions: MultipleChoiceQuestion[];
}

export const examState = atom({
  key: "exam-state",
  default: undefined as Exam | undefined,
  effects_UNSTABLE: [localStorageEffect("exam")],
});

export const answersState = atom({
  key: "answers-state",
  default: {} as IMap,
  effects_UNSTABLE: [localStorageEffect("answers")],
});

export const apiKeyState = atom({
  key: "api-key-state",
  default: "",
  effects_UNSTABLE: [localStorageEffect("api-key")],
});
