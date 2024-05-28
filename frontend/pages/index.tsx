import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { SearchBox } from "@/components/searchbox";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>{siteConfig.name}&nbsp;</h1>
          <h4 className={subtitle({ class: "mt-4" })}>房屋出租平台🐷</h4>
        </div>

        <div className="flex gap-4">
          <SearchBox className="w-96" />
        </div>

        <div className="mt-8">
          <h4 className={subtitle({ class: "mt-4" })}>搜尋結果TODO</h4>
        </div>
      </section>
    </DefaultLayout>
  );
}
