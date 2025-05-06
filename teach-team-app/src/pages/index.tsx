import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getUserType, isPasswordValid, userCred } from "@/helpers/validate";
import {useRouter} from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

export default function Home() {
  const router = useRouter();
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

      const user: userCred = {email: localEmail, password:localPassword};
      const passwordValid = isPasswordValid(user);
      const loginType = getUserType(user.email);
      
      //Checks if user is logged in, if not redirect to login.
      useEffect(() => {
          if (!passwordValid) {
            router.push('/login');
          }
      }, [passwordValid, router]);


  return (
    <>
      <title>Index</title>
      <Header isLoggedIn={passwordValid} accountType={loginType}/>
      <LoadingScreen/>
      <Footer isLoggedIn={passwordValid} type={loginType}/>
    </>
  );
}
