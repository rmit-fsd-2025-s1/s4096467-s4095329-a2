import Image from "next/image";
import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import {Sidebar} from "../components/Sidebar/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { getUserType, isPasswordValid, userCred } from "@/helpers/validate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const[localEmail, setLocalEmail] = useState<string>("");
      const[localPassword, setLocalPassword] = useState<string>("");
      
      useEffect(() => 
      {
          setLocalEmail(localStorage.getItem("localEmail")||"");
      }, []);
      
      useEffect(() => 
      {
          setLocalPassword(localStorage.getItem("localPassword")||"");
      }, []);

      let user: userCred = {email: localEmail, password:localPassword};
      let passwordValid = isPasswordValid(user);
      let loginType = getUserType(user.email);

  return (
    <>
      <title>Index</title>
      <Header isLoggedIn={passwordValid} />
      <Sidebar/>
      <p> Text Here </p>
      <Footer isLoggedIn={passwordValid} type={loginType}/>
    </>
  );
}
