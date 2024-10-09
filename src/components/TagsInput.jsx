import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

//Component which handles the tag input such that it seems like an input field and on pressing enter or comma it serves as input tag
export default function TagsInput({ name, onChange, value }) {
  const [tag, setTag] = useState(""); //state manages input field in the tag
  const [tags, setTags] = useState([]); //State manages all the lists of tags

  // console.log(tags);
  const input = useRef(); //Reference to the input field
  const tagsInput = useRef(); //Rfereence to the div which seems like input field

  //Helper function which handle the change in the input field in the tag div
  const handleOnChange = ({ target }) => {
    const { value } = target;
    //set the tag  state to the current value
    if (value !== ",") setTag(value);
    onChange(tags);
  };

  // Helper function which get the key strokes handles the event that to be happended after pressing comma , eneter and backspace
  const handleKeyDown = ({ key }) => {
    //When comma and enter
    if (key === "," || key === "Enter") {
      //Before handling enter event prevent all default submission on the form and change button type to button rather tahn default submit type
      if (!tag) return; //If there is no tag then do nothing

      if (tags.includes(tag)) return setTag(""); //If alreadt required tag is in array then ignore and reset

      // Put in tags array and reset
      setTags([...tags, tag]);
      setTag("");
    }

    //Handling backspace key press and only if there is no character in tag input field and
    if (key === "Backspace" && !tag && tags.length) {
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };
  // Fuction which handles the deletion of provided tag from the given tags array
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove); //Filter that provided tag
    setTags([...newTags]);
  };

  //Helper function which gives focus event on the div acting as input field by adding and removing classes to div by
  //using the focus  property of input filed inside it.
  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  //Helper function which gives blur event on the div acting as input field by adding and removing classes to div by
  //using the blur  property of input filed inside it.
  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  useEffect(() => {
    if (value.length) setTags(value);
  }, [value]);

  //To always scroll to the view to the input filed
  useEffect(() => {
    input.current?.scrollIntoView(false);
  }, [tag]);

  return (
    <div>
      <div //wrapper div acts as input field with given styles
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      >
        {/* Inside this wrapper div put all the elements of tags array into the Tag component iside this div */}
        {tags.map((t) => (
          <Tag onClick={() => removeTag(t)} key={t}>
            {t}
          </Tag>
        ))}
        {/* Create a input field for getting input and bind it with value of tag state*/}
        <input
          ref={input}
          type="text"
          id={name}
          className="h-full flex-grow bg-transparent outline-none dark:text-white"
          placeholder="Tag one, Tag two"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

//Tag Component which have gets an onClick listener added to button to delete that tag
const Tag = ({ children, onClick }) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {children}
      <button onClick={onClick} type="button">
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
