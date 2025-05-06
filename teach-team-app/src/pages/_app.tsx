import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
import "../styles/user-home.css";
import "../components/Header/Header.css";
import "../components/Home/Home.css";
import "../components/SortingTable/Comments.css";
import "../components/SortingTable/SortingTable.css";
import "../pages/sign-in.css";
import "../pages/educator/subjectManager.css";
import "../pages/educator/userProfile.css";
import type { AppProps } from "next/app";
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <></>
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
      </>
    );
}
