export type APIResponse<T> = {
  error: boolean;
  message: string;
  data: T;
};

export type ExamPayload = {
  examName: string;
  numberOfQuestions: number;
  apiKey: string;
};
