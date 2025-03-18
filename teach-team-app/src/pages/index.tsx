import Image from "next/image";
import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <title>Index</title>
      <Header isLoggedIn={true} />
      <p> Text Here </p>
      <Footer isLoggedIn={true} type=""/>
    </>
  );
}
