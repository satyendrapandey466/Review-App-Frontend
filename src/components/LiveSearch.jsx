import React, { useEffect, useRef, useState, forwardRef } from "react";
import { commonInputClasses } from "../utils/theme";

//Live Search Component which renders the live search input
export default function LiveSearch({
  value = "",
  placeholder = "",
  results = [], //actual array of actors
  name,
  resultContainerStyle, //styles that are provided to each actor's container
  selectedResultStyle, //styles that are provided to the selected container
  inputStyle, //style that is provided to input
  renderItem = null, //Fuction which handles the rendering of each item of results array
  onChange = null,
  onSelect = null,
}) {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [defaultValue, setDefaultValue] = useState("");

  //To create a helper function which shows the live search when the profile div is active
  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };

  //Helper function to hide the live search div
  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };

  //Helper function to hide the live search when focus is away from profile div
  const handleOnBlur = () => {
    closeSearch();
  };

  //Helper function handles the select event on current active or clicked profile
  const handleSelection = (selectedItem) => {
    if (selectedItem) {
      onSelect(selectedItem);
      closeSearch();
    }
  };

  //Helper functions which provide functionality to control what  happens when some keys are pressed
  const handleKeyDown = ({ key }) => {
    let nextCount;

    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"]; //Functionality is for these keys only if other key then do nothing
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }
    //On esc key close the livesearch component
    if (key === "Escape") return closeSearch();

    //On enter press trigger the select on that index
    if (key === "Enter") return handleSelection(results[focusedIndex]);

    setFocusedIndex(nextCount);
  };

  //Helper  function which gets inputstyles from prop and provides some additional styling to it
  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : commonInputClasses + " border-2 rounded p-1 text-lg";
  };

  // //Helper function handles the change in the input field of the live search field
  const handleChange = (e) => {
    setDefaultValue(e.target.value);
    onChange && onChange(e);
  };

  //To set the default value or showing value of inputfield initally as the provided value
  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  //To hide the the livesearch modal if nothing is typing
  useEffect(() => {
    if (results.length) return setDisplaySearch(true);
    setDisplaySearch(false);
  }, [results.length]);

  return (
    <div
      tabIndex={1}
      onKeyDown={handleKeyDown}
      onBlur={handleOnBlur}
      className="relative outline-none"
    >
      {/**exterior div providing wrapper and  background */}
      <input
        type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        value={defaultValue}
        onChange={handleChange}
        // onBlur={handleOnBlur}
        // onKeyDown={handleKeyDown}
      />
      {/* This is where all the results array data is renderedinto list format  */}
      <SearchResults
        results={results}
        visible={displaySearch}
        focusedIndex={focusedIndex}
        onSelect={handleSelection}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
}

// const renderItem = ({ id, name, avatar }) => {
//   return (
//     <div className="flex">
//       <img src={avatar} alt="" />
//       <p>{name}</p>
//     </div>
//   );
// };

//This component renders the list items of the result array of all profiles
const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  const resultContainer = useRef();

  //Always scroll the view to the current active index to make it in middle
  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  if (!visible) return null;

  return (
    <div className="absolute z-50 right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
      {results.map((result, index) => {
        //maping all the elemts of results array to shown as in ResultCard component with some additional styles
        const getSelectedClass = () => {
          return selectedResultStyle
            ? selectedResultStyle
            : "dark:bg-dark-subtle bg-light-subtle";
        };
        return (
          <ResultCard
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={
              //if index is equal to focus index then highligh it
              index === focusedIndex ? getSelectedClass() : ""
            }
            onMouseDown={() => onSelect(result)}//to handle mouse click event
          />
        );
      })}
    </div>
  );
};

// Component with a ref forwarded from its parent component and renders each particular result
const ResultCard = forwardRef((props, ref) => {
  const {
    item,
    renderItem,
    resultContainerStyle,
    selectedResultStyle,
    onMouseDown,
  } = props;

  const getClasses = () => {
    if (resultContainerStyle)
      return resultContainerStyle + " " + selectedResultStyle;

    return (
      selectedResultStyle +
      " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
    );
  };
  return (
    <div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
      {renderItem(item)}
    </div>
  );
});
