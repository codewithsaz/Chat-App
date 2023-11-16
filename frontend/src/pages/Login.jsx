import React from "react";
import { Input, Image, Button, Card, Link as ExtLink } from "@nextui-org/react";
import { Link } from "react-router-dom";

const Login = () => {
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
            src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
          />
        </div>
        <div className="w-full flex justify-center items-center gap-2 px-2">
          <Button className="w-full">Guest User 1</Button>
          <Button className="w-full">Guest User 2</Button>
        </div>
        <div
          id="register-form"
          className="w-full flex flex-col gap-2 p-2 max-w-xl"
        >
          <Input type="email" label="Email" placeholder="Enter your email" />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          <span className="text-center text-xs md:text-base">
            By logging you accept out{" "}
            <ExtLink
              isExternal
              href="https://github.com/nextui-org/nextui"
              showAnchorIcon
              className="text-xs md:text-base"
            >
              terms and conditions
            </ExtLink>
          </span>
          <Button color="success">Login In</Button>
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
