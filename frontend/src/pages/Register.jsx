import React, { useState } from "react";
import { Input, Image, Button, Card, Link as ExtLink } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handlevalidation() {}

  async function handleRegister() {
    try {
      const signUpObj = {
        name: name,
        phone: phone,
        email: email,
        password: password,
      };
      const res = await axios.post(baseURL + "/user/signup", signUpObj);
      console.log(res);
      if (res.data.success) {
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center p-2">
      <Card
        id="wrapper"
        className="w-auto flex flex-col justify-center items-center p-2 gap-1 rounded-lg "
      >
        <h1 className=" font-sans text-3xl text-center font-bold">Register</h1>

        <div id="image-section" className="w-full p-2 max-w-lg">
          <Image
            alt="NextUI hero Image"
            src="https://assets-global.website-files.com/5e2f2362e479664d4e15718a/63adca2bb966f51c1fa582ee_aivo-live-chat-en-p-1080.png"
            className="h-80"
          />
        </div>
        <div
          id="register-form"
          className="w-full flex flex-col gap-2 p-2 max-w-lg"
        >
          <Input
            type="text"
            label="Name"
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            type="tel"
            label="Phone"
            placeholder="Enter your phone number"
            onChange={(e) => {
              setPhone(e.target.value);
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
            By registering you accept our{" "}
            <ExtLink
              isExternal
              href="https://www.termsfeed.com/public/uploads/2021/12/sample-terms-conditions-agreement.pdf"
              showAnchorIcon
              className="text-xs md:text-base"
            >
              terms and conditions
            </ExtLink>
          </span>
          <Button color="success" onClick={handleRegister}>
            Register
          </Button>
          <span className="text-center text-xs md:text-base">
            {" "}
            ALready a User?{" "}
            <Link to="/login" className=" underline">
              Login
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
