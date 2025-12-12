import FormInput from "@/app/FormInput";
import SubmitButton from "@/app/SubmitButton";
import React from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import ErrorMessage from "@/app/ErrorMessage";

const LoginForm = ({ setUser }) => {
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ errorMessage, setErrorMessage ] = React.useState("");
  const [ canSubmit, setCanSubmit ]       = React.useState(true);
  const router = useRouter();

  const checkFields = () => {
    return username && password;
  }

  const login = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setCanSubmit(false);

    // don't try to log in if the user didn't provide a username and password
    if (!username || !password) {
      setErrorMessage(`Error: Username or password is blank`);
      return;
    }

    const user_query = { user_name: username, user_password: password };

    try {
      const {data} = await axios.post("/api/authenticate", user_query);
      if (data.authenticated === true) {
        setUser({ ...data.account });
        setUsername("");
        setPassword("");
        router.push("/terminal/help");
      }
    } catch (error) {
      console.log(error);
      const reason = error.response?.data?.reason
      const message = reason ? `Error: ${reason}` : `Unexpected error... Please try again later`;
      setErrorMessage(message);
      setPassword("");
      setCanSubmit(checkFields());
    }
  }

  return (
    <form onSubmit={login} className="flex flex-col">
      <h2 className="text-xl mb-4">Enter your credentials</h2>
      <ErrorMessage message={errorMessage}></ErrorMessage>
      <div className="flex flex-col mb-2 md:flex-row mb-8 md:mb-6">
        <div className="mb-6 md:mb-0 md:w-1/2 md:pr-2">
          <FormInput labelText="Username" text={username} setText={setUsername} autofill="username"></FormInput>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <FormInput inputType="password" labelText="Password" text={password} setText={setPassword} autofill="current-password"></FormInput>
        </div>
      </div>
      <SubmitButton text="Log in" canSubmit={canSubmit && checkFields()} theme="terminal"></SubmitButton>
    </form>
  )
}

export default LoginForm;