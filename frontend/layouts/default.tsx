import { Link } from "@nextui-org/react";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="our-test-theme relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3 gap-1">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p>黃薇倫的弟弟與朋友和弟弟的同學</p>
        </Link>
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
      </footer>
    </div>
  );
}
