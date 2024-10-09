import React from "react";

//A wrapper component for styling the components

export default function Container({ children, className }) {
  return (
    <div className={"max-w-screen-xl mx-auto " + className}>{children}</div>
  );
}
