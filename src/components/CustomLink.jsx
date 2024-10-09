import React from "react";
import { Link } from "react-router-dom";

//A custom component created as replacement of anchor tag of html by using Link component provided by react-router-dom

export default function CustomLink({ to, children }) {
  return (
    <Link
      className="dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary transition"
      to={to}
    >
      {children}
    </Link>
  );
}
