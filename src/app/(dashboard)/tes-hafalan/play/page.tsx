import { getSantris } from "@/actions/santri";
import QuizClient from "./QuizClient";

export const metadata = {
  title: "Mulai Tes Hafalan - HafalanQu",
};

export default async function QuizPlayPage() {
  const santris = await getSantris();
  
  return <QuizClient santris={santris} />;
}
