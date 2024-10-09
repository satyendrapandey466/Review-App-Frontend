import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks";
import AppSearchForm from "../form/AppSearchForm";

//Component which renders the header with search toggle and create buttons on every page in admin UI
export default function Header({ onAddActorClick, onAddMovieClick }) {
  const [showOptions, setShowOptions] = useState(false); //State which manages the drop down menu of create button
  const { toggleTheme } = useTheme(); //Theme changing context

  const navigate = useNavigate();

  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;

    navigate("/search?title=" + query);
  };

  return (
    <div className="flex items-center justify-between relative p-5">
      {/* This is the search form input */}
      <AppSearchForm
        onSubmit={handleSearchSubmit}
        placeholder="Search Movies..."
      />

      {/* This is the right half with create button and dropdown menu */}
      <div className="flex items-center space-x-3">
        {/* Theme changing button */}
        <button
          onClick={toggleTheme}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>

        {/* This is the create button which has click event listener to handle the drop down menu for create form */}
        <button
          onClick={() => setShowOptions(true)} //Setting the visible status of dropdown button to true
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          <span>Create</span>
          <AiOutlinePlus />
        </button>

        {/* This is the component which shows the drop down menu */}
        <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)} //Function which will set the visible state of drop dwon to false
          options={options}
        />
      </div>
    </div>
  );
}

//This component renders the drop down menu
const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef(); //Reference to the current element
  const containerID = "options-container"; //an variable having id of current element div

  //This will handle the sideeffect of change in showOption state and click on the document
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return; //if it is not visble return as there drop down div is not rendered
      const { parentElement, id } = e.target; //Acquiring the id of clicked div parent and current div

      if (parentElement.id === containerID || id === containerID) return; //if div that is clicked are those buttons or it backdrop div then do nothing

      if (container.current) {
        //if the current div is rendered or mounted
        if (!container.current.classList.contains("animate-scale"))
          //if it has drop down class add reverse animation class
          container.current.classList.add("animate-scale-reverse");
      }
    };

    //adding even on the whole page to listen any clicks
    document.addEventListener("click", handleClose);
    return () => {
      //reset all the eventlisteners
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  //This is helper function which handles the click on the drop down menu
  const handleClick = (fn) => {
    fn();
    onClose();
  };

  //If visible state of dropdown menu is false then do not render the component
  if (!visible) return null;

  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 z-50 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={(e) => {
        if (e.target.classList.contains("animate-scale-reverse")) onClose();
        e.target.classList.remove("animate-scale");
      }}
    >
      {/* this will just handle the option provided in the drop down menu */}
      {options.map(({ title, onClick }) => {
        return (
          <Option key={title} onClick={() => handleClick(onClick)}>
            {title}
          </Option>
        );
      })}
    </div>
  );
};

//Component which renders custom button with some styles
const Option = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="dark:text-white text-secondary hover:opacity-80 transition"
    >
      {children}
    </button>
  );
};
