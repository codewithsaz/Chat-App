import React, { useState } from "react";
import { Input, Image, Button, Card, Link as ExtLink } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import useUserStore from "../store/userStore";
// axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const { setUser } = useUserStore((state) => ({
    setUser: state.setUser,
  }));

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handlevalidation() {}

  async function handleLogin() {
    try {
      const loginObj = {
        email: email,
        password: password,
      };
      const res = await axios.post(baseURL + "/user/login", loginObj);
      console.log(res);
      localStorage.setItem("token", res.data.token);
      if (res.data.success) {
        setUser(res.data.user);
        navigate("/chat/personal");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }
  async function handleGuestOneLogin() {
    try {
      const loginObj = {
        email: "demo1@email.com",
        password: "demo1",
      };
      const res = await axios.post(baseURL + "/user/login", loginObj);
      // console.log(res);
      localStorage.setItem("token", res.data.token);
      if (res.data.success) {
        setUser(res.data.user);
        navigate("/chat/personal");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }
  async function handleGuestTwoLogin() {
    try {
      const loginObj = {
        email: "demo2@email.com",
        password: "demo2",
      };
      const res = await axios.post(baseURL + "/user/login", loginObj);
      console.log(res);
      localStorage.setItem("token", res.data.token);
      if (res.data.success) {
        setUser(res.data.user);
        navigate("/chat/personal");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-2">
      <Card
        id="wrapper"
        className="w-auto flex flex-col justify-center items-center p-2  gap-1 rounded-lg "
      >
        <h1 className=" font-sans text-3xl text-center font-bold">Login</h1>

        <div id="image-section" className="w-full p-2 max-w-lg">
          <Image
            alt="NextUI hero Image"
            src="https://assets-global.website-files.com/5e2f2362e479664d4e15718a/63adca2bb966f51c1fa582ee_aivo-live-chat-en-p-1080.png"
          />
        </div>
        <div className="w-full flex justify-center items-center gap-2 px-2">
          <Button
            className="w-full hover:bg-green-500"
            onClick={handleGuestOneLogin}
          >
            Guest User 1
          </Button>
          <Button
            className="w-full hover:bg-green-500"
            onClick={handleGuestTwoLogin}
          >
            Guest User 2
          </Button>
        </div>
        <div
          id="register-form"
          className="w-full flex flex-col gap-2 p-2 max-w-xl"
        >
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            isInvalid={emailError}
            errorMessage={emailError ? "Please enter a valid email" : ""}
            onChange={(e) => {
              setEmailError(false);
              setEmail(e.target.value);
            }}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <span className="text-center text-xs md:text-base">
            By logging you accept out{" "}
            <ExtLink
              isExternal
              href="https://www.termsfeed.com/public/uploads/2021/12/sample-terms-conditions-agreement.pdf"
              showAnchorIcon
              className="text-xs md:text-base"
            >
              terms and conditions
            </ExtLink>
          </span>
          <p className="text-center text-red-500">{errorMessage}</p>
          <Button color="success" onClick={handleLogin}>
            Login In
          </Button>
          <span className="text-center text-xs md:text-base">
            {" "}
            New User?{" "}
            <Link to="/register" className=" underline">
              Register
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Login;
