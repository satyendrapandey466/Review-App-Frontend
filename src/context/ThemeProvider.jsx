// This is the theme context api which manages the theme stores theme details in the local storage and helps in toggling
import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext();

//Default theme naming
const defaultTheme = "light";
const darkTheme = "dark";

export default function ThemeProvider({ children }) {

  //Fuction which hadles the toggling of theme and fetches prvious theme from local storage else sets to default theme
  const toggleTheme = () => {
    const oldTheme = getTheme();
    const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

    updateTheme(newTheme, oldTheme);
  };

  //Use to toggle the update theme when the page renders first time according to its previous stored theme
  useEffect(() => {
    const theme = getTheme();
    if (!theme) updateTheme(defaultTheme);
    else updateTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

//Helper function which helps to get theme from the localstorage if previously stored
const getTheme = () => localStorage.getItem("theme");

//Helper function which takes theme and theme which is to be removed and perform operation
//If themetoRemove is not provided then it only adds the provided theme to localstorage
const updateTheme = (theme, themeToRemove) => {
  //inserts/removes the class to the main html tag as the dark or default
  if (themeToRemove) document.documentElement.classList.remove(themeToRemove);

  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
};
