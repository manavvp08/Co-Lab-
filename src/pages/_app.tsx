import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

import Head from "next/head";


import { Outfit } from 'next/font/google';
const font = Outfit({ subsets: ['latin'] });

import { ThemeProvider } from "@/components/theme-provider"
import ThemeToggle from '@/components/theme-toggle'

import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/toaster";

import { APP_NAME } from "@/data/constants";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="Portfolio system for developers" />
        <link rel="icon" href="/logo.jpg" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className={`${font.className} dark:bg-slate-800`}>
          <header className="top-0 sticky z-50">
            <Header />
          </header>
          <Component {...pageProps} />
          <div className='bottom-5 left-0 p-4 fixed'>
            <ThemeToggle />
          </div>
        </main>
      </ThemeProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
