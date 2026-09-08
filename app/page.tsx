import { Suspense } from "react";
import GeneratorApp from "@/components/GeneratorApp";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <GeneratorApp />
    </Suspense>
  );
}
