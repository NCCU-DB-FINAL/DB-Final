import { useRouter } from "next/router";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { FetchSingleUser } from "@/components/fetchTest";

export default function ApiTestPage() {
  const router = useRouter();
  const userId = router.query.slug;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>以 user id 當 query URL</h1>
          <p>Uid: {router.query.slug}</p>
          <p>Data: </p>
          <FetchSingleUser uid={userId} />
        </div>
      </section>
    </DefaultLayout>
  );
}
