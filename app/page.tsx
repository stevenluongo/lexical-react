import dynamic from "next/dynamic";
import { Logo } from "./logo";
const LexicalEditor = dynamic(() => import("./app"), { ssr: false });

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LexicalEditor />
      <Logo />
    </main>
  );
}
