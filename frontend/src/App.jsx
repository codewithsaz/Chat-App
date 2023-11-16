import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Input } from "@nextui-org/react";
import "./App.css";
import MainLayout from "./layouts/MainLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="w-full h-screen  text-foreground bg-background">
      <MainLayout />
    </main>
  );
}

export default App;
