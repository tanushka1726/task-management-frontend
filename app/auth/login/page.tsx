"use client";
import { useState, useContext } from "react";
import { loginUser } from "@/services/auth.services";
import { AuthContext } from "@/context/AuthContext";
import api from "@/services/api";
import { API_PATHS } from "@/services/api";
import { validateEmail} from "@/utils/helper";
import { AxiosError } from "axios";
import Input from "@/components/Inputs/input";

export default function Login({setCurrentPage}:{setCurrentPage: (page:string) => void}) {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is not available");
  }
  const { login } = auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Password cannot be empty.");
      return;
    }
    setError("");
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      },
    {withCredentials:true},);

    if(response.status === 200 && response.data.accessToken){
      const userRes = await api.get(API_PATHS.AUTH.CHECK_LOGIN, {
        withCredentials:true,
      });
      localStorage.setItem("user", JSON.stringify(userRes.data));
      login(response.data.accessToken);
      setCurrentPage("home");
    }else{
      setError(response.data?.message || "Invalid email or password.");

    }
  }
    catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response && axiosError.response.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError("Something went wrong! Please try again.");
      }
    }
   
  };

  return (
     <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>


      <h3 className=" text-2xl font-bold text-black ">Welcome Back!!</h3>
      <p className="text-lg text-slate-700 mt-1.25 mb-6"> Please enter your details to Log In</p>
      <form action="" onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          label="Email Address"
          placeholder="@john@gmail.com"
          type="text"
        />
        <Input
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>LOGIN</button>
        <p className="text-[13px] text-slate-800 mt-3">Don't have an account ? {""}
          <button className="font-medium text-primary underline cursor-pointer" onClick={() => {
            setCurrentPage("signup")
          }}>
            Signup
          </button>
        </p>

      </form>

    </div>
  )
}

