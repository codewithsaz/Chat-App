import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Input } from "@nextui-org/react";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <main className="w-full h-screen  text-foreground bg-background">
      <MainLayout />
      <ToastContainer />
    </main>
  );
}

export default App;
