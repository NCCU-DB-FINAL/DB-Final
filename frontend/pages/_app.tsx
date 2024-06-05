import type { AppProps } from "next/app";

import { useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";

import "@/styles/globals.css";

import { User, UserContext } from "@/components/context/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = JSON.parse(localStorage.getItem("RENT_USER") || "null");

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider>
          <Component {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </UserContext.Provider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
