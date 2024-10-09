import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";

//Default actor form values which is set initially
const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

//Validation method to validate actor form values
const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) return { error: "Actor name is missing!" };
  if (!about.trim()) return { error: "About section is empty!" };
  if (!gender.trim()) return { error: "Actor gender is missing!" };
  if (avatar && !avatar.type?.startsWith("image"))
    //valadity checking if uploaded data is image or not
    return { error: "Invalid image / avatar file!" };

  return { error: null };
};

//Component which renders form for actor creation
export default function ActorForm({ title, btnTitle, busy,initialState, onSubmit }) {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo }); //state that manages actorInfo details intialised with  default data
  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState(""); //state managing the Poster UI which is to be shown on poster
  const { updateNotification } = useNotification();

  //When any file is selected change posterUI to file's link so thet selected image is shown in place of poster form
  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file); //Converting file object to URL
    setSelectedAvatarForUI(url);
  };

  //Hanadling any kind of change in the form
  const handleChange = ({ target }) => {
    //Destructuring all the details from the data provided to the function
    const { value, files, name } = target;
    if (name === "avatar") {
      //Handling the image case for poster
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file }); //Updating the actorInfo details
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  //Handling the submit event is occured on the form
  const handleSubmit = (e) => {
    e.preventDefault(); //Prevent the defaukt submit
    const { error } = validateActor(actorInfo); //Validating the details in the form
    if (error) return updateNotification("error", error); //changing notification regarding error

    // submit form
    const formData = new FormData(); //Creation of a form data
    for (let key in actorInfo) {
      if (key) formData.append(key, actorInfo[key]); //Appending all details to the formdata
    }
    onSubmit(formData); //Sending the formdata to the onSubmit prop function for upload
  };
  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);

  const { name, about, gender } = actorInfo;
  return (
    <form
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      <div className="flex space-x-2">
        <PosterSelector //Poster Selector UI
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover"
          name="avatar"
          onChange={handleChange}
          lable="Select avatar"
          accept="image/jpg, image/jpeg, image/png"
        />
        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
}
