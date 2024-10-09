import React from "react";

//Component which shows custom selector fields
export default function Selector({ name //name of selector field
, options //options provided
, value //what is the value to e attached
, label //label for selector
, onChange //An function which triggers on change in selector input field
}) {
  return (
    <select
      className="border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary p-1 pr-10 outline-none transition rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
}
