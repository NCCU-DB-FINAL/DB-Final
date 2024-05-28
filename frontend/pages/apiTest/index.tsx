import { Code, Snippet } from "@nextui-org/react";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Fetch } from "@/components/fetchTest";

export default function ApiTestPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>API test</h1>
        </div>
        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>
              Testing fetch API data. <br /> See{" "}
              <Code color="primary">pages/apiTest/index.tsx</Code>
              and <Code color="primary">components/fetchTest.jsx.tsx</Code>
            </span>
          </Snippet>
        </div>
        <div className="mt-8  max-w-lg text-center justify-center">
          <Fetch />
        </div>
      </section>
    </DefaultLayout>
  );
}
