import { Icon } from "@iconify/react";
import React, { useState } from "react";

const ToogleThemeButton = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    // Toggle the darkMode state
    setDarkMode(!darkMode);

    // Toggle the 'dark' class on the <html> tag
    const htmlElement = document.documentElement;
    if (!darkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="text-sigmaPrimary   p-1 rounded hover:bg-sigmaPrimary hover:text-green-700"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <Icon icon="mingcute:sun-fill" width={30} height={30} /> // Display sun icon in dark mode
        ) : (
          <Icon icon="ph:moon-fill" width={30} height={30} /> // Display moon icon in light mode
        )}
      </button>
    </div>
  );
};

export default ToogleThemeButton;
