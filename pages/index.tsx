import Head from "next/head";
import { VStack } from "@chakra-ui/react";
import { ExamForm } from "@/components/ExamForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ruddy GPT</title>
        <meta
          name="description"
          content="App using GPT-3-turbo and local storage to generate practice exams"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack p="6">
        <ExamForm />
      </VStack>
    </>
  );
}
