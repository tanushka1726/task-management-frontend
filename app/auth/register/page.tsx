"use client";
import { useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/auth.services";
import  {validateEmail}from "@/utils/helper";
import { AuthContext } from '@/context/AuthContext';
import api from "@/services/api";
import API_PATHS from "@/utils/apiPaths";
import Input from "@/components/Inputs/input";

export default function Register() {
  const [fullName , setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const authContext = useContext(AuthContext);
  const {login} = authContext || {};
  const navigate = useNavigate();
 

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      const response = await api.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      }, {withCredentials: true}
      )
      if (login) {
        login(response.data.user || response.data)
        navigate("/home")
      }
    }
    catch (error: any) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);

      } else {
        setError("Something went wrong! Please try again")
        console.error("Error : ",error);
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-black">
          Create an Account
        </h3>
        <p className='text-lg text-slate-700 mt-1.25 mb-6'>
          Join us today by entering your details
        </p>


        <form onSubmit={handleRegister} >
          

          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <Input value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="FullName"
              placeholder="John"
              type='text'
            />

            <Input value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="John@gmail.com"
              type='text'
            />

            <Input value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="password"
              type="password"
              placeholder='Min 8 characters'
            />

          </div>
          {error && <p className='text-red-500 text-xs pb-[2.5]'>{error}</p>}
          <button type='submit' className='btn-primary'>SIGN UP</button>

          <p className="text-[13px] text-slate-800 mt-3">Already have an account ? {" "}
            <button className="font-medium text-primary underline cursor-pointer"
              onClick={() => {
                navigate("/login")
              }}>LOGIN</button>
          </p>


        </form>
      </div>
    



  )
}



