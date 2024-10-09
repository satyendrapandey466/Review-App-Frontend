import React from "react";

//Just a wrapper component which makes text sixe larger (1.25 rem) color white font to semibold and aligns text to center

export default function Title({ children }) {
  return (
    <h1 className="text-xl dark:text-white text-secondary font-semibold text-center">
      {children}
    </h1>
  );
}
