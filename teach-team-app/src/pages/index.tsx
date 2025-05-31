import {Header} from "../components/Header/Header";
import {Footer} from "../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getUserType, isPasswordValid, userCred } from "@/helpers/validate";
import {useRouter} from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";
import { Image, Link} from "@chakra-ui/react"
import "./index.css";


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
      // Variable hook that checks to see if the user is logged in properly
      const [passwordValid, setPasswordValid] = useState<boolean>(false);
      useEffect(() => {
          const validatePassword = async () => {
              const isValid = await isPasswordValid(user);
              setPasswordValid(isValid);
          };
          validatePassword();
      }, [user]);

      const [loginType, setLoginType] = useState<string>("");
      useEffect(() => {
        const getTypeVal = async () => {
            const type = await getUserType(user.email);
            if(typeof type === "boolean")
            {
                setLoginType("");
            }
            else
            {
                setLoginType(type);
            }
        };
        getTypeVal();
    }, [user]);
      
      // //Checks if user is logged in, if not redirect to login.
      // useEffect(() => {
      //     if (!passwordValid) {
      //       router.push('/login');
      //     }
      // }, [passwordValid, router]);


  return (
    <>
      <title>Index</title>
      <Header isLoggedIn={passwordValid} accountType={loginType}/>
        <div className="bodybox">
          <div className="textside">
            <h1>Join Our Teaching Team</h1>
            <p>Inspire. Teach. Grow. Become a tutor and shape the future, one student at a time.</p>
            <Link href="/login" className="login-btn">Login</Link>
            <p>New to TeachTeam?</p>
            <Link href="/register" className="reg-btn">Register</Link>
          </div>
        </div>
      {/* <LoadingScreen/> */}
      <div className="uniquefooter">

      </div>
      {/* <Footer isLoggedIn={passwordValid} type={loginType}/> */}
    </>
  );
}
