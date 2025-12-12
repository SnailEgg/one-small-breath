import FormInput from "@/app/FormInput";
import SubmitButton from "@/app/SubmitButton";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/app/ErrorMessage";

const RegisterForm = ({ setUser }) => {
    const [ username, setUsername ]         = React.useState("");
    const [ password, setPassword ]         = React.useState("");
    const [ rePassword, setRePassword ]     = React.useState("");
    const [ fullName, setFullName ]         = React.useState("");
    const [ errorMessage, setErrorMessage ] = React.useState("");
    const [ canSubmit, setCanSubmit ]       = React.useState(true);
    const router = useRouter();

    const minUsernameLength = 4;
    const maxUsernameLength = 12;
    const minPasswordLength = 6;

    const usernameRegex = /^[\d\w_]+$/;

    const checkFields = () => {
      return username && password && rePassword && fullName;
    }

    const register = async (event) => {
      event.preventDefault();

      setErrorMessage("");

      if (!username || !password || !rePassword || !fullName) {
        setErrorMessage("Error: One or more fields are blank");
        return;
      }

      if (username.length < minUsernameLength || username.length > maxUsernameLength) {
        setErrorMessage(`Error: Username must be between ${minUsernameLength} and ${maxUsernameLength} characters`);
        return;
      }

      if (!usernameRegex.test(username)) {
        setErrorMessage("Error: Username may only contain letters, numbers, and underscores");
        return;
      }

      if (password.length < minPasswordLength) {
        setErrorMessage("Error: Password must be at least 6 characters");
        return;
      }

      if (password !== rePassword) {
        setErrorMessage("Error: Passwords don't match");
        return;
      }

      setCanSubmit(false);

      const registerQuery = {
        "username": username.toLowerCase(),
        "password": password,
        "name": fullName 
      }

      const loginQuery = {
        "user_name": username.toLowerCase(),
        "user_password": password,
      }

      try {
        await axios.post("https://jordan-project.demo.compsci.cc/api/register", registerQuery);
        const { data } = await axios.post("https://jordan-project.demo.compsci.cc/api/authenticate", loginQuery);
        setUser( { ...data.account } );
        setUsername('');
        setPassword('');
        setRePassword('');
        setFullName('');
        router.push("/terminal/help");
      } catch (error) {
        const reason = error.response?.data?.reason
        const message = reason ? `Error: ${reason}` : `Unexpected error... Please try again later`;
        setErrorMessage(message);
      }

      setCanSubmit(true);
    }

    return (
        <form onSubmit={register} className="flex flex-col">
            <h2 className="text-xl mb-4">Provide your details</h2>
            <ErrorMessage message={errorMessage}></ErrorMessage>
            <div className="flex flex-col mb-8 md:mb-6">
                <div className="mb-6">
                    <FormInput labelText="Username" text={username} setText={setUsername} autofill="username"></FormInput>
                </div>
                <div className="flex flex-col md:flex-row mb-6">
                    <div className="mb-2 md:mb-0 md:w-1/2 md:pr-2">
                        <FormInput inputType="password" labelText="Password" text={password} setText={setPassword} autofill="new-password"></FormInput>
                    </div>
                    <div className="md:w-1/2 md:pl-2">
                        <FormInput inputType="password" labelText="Re-enter Password" text={rePassword} setText={setRePassword} autofill="new-password"></FormInput>
                    </div>
                </div>
                <div className="mb-2">
                    <FormInput labelText="Your Full Name" text={fullName} setText={setFullName} autofill="name"></FormInput>
                </div>
            </div>
            <SubmitButton text="Register profile" canSubmit={canSubmit && checkFields()} theme="terminal"></SubmitButton>
        </form>
    )
}

export default RegisterForm;