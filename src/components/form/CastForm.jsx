import React, { useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import LiveSearch from "../LiveSearch";
import { results } from "../admin/MovieForm";
import { useNotification, useSearch } from "../../hooks";
import { renderItem } from "../../utils/helper";
import { searchActor } from "../../api/actor";
//Deafult cast Info values which is set initially
const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};

//Component which handles the form for cast input field in original movie  upload form
export default function CastForm({ onSubmit }) {
  const [castInfo, setCastInfo] = useState({ ...defaultCastInfo });
  const [profiles, setProfiles] = useState([]);

  const { updateNotification } = useNotification();
  const { handleSearch, resetSearch } = useSearch();

  //Function which manages the changes in the fields of the form
  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;

    //if checkbox is true then set leadactor as checked
    if (name === "leadActor")
      return setCastInfo({ ...castInfo, leadActor: checked });

    setCastInfo({ ...castInfo, [name]: value }); //commit the data into Cast Info
  };

  //Profile selected data is updated in cast info profile
  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };

  //handles when when submit or enter is triggered on livesearch bar items
  const handleSubmit = () => {
    const { profile, roleAs } = castInfo;
    if (!profile.name)
      return updateNotification("error", "Cast profile is missing!");
    if (!roleAs.trim())
      return updateNotification("error", "Cast role is missing!");

    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
    resetSearch();
  };

  //When profile is selcted
  const handleProfileChange = ({ target }) => {
    const { value } = target;
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    handleSearch(searchActor, value, setProfiles);
  };

  const { leadActor, profile, roleAs } = castInfo;
  return (
    <div className="flex items-center space-x-2">
      <input //Check box which indicates about lead actor
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        checked={leadActor}
        onChange={handleOnChange}
        title="Set as lead actor" //to indicate what is this checkbox about when hovered on
      />
      {/* Live search bar for profile */}
      <LiveSearch
        placeholder="Search profile"
        value={profile.name}
        results={profiles}
        onSelect={handleProfileSelect}
        renderItem={renderItem}
        onChange={handleProfileChange}
      />
      <span className="dark:text-dark-subtle text-light-subtle font-semibold">
        as
      </span>
      {/* Input field  */}
      <div className="flex-grow">
        <input
          type="text"
          className={commonInputClasses + " rounded p-1 text-lg border-2"}
          placeholder="Role as"
          name="roleAs"
          value={roleAs}
          onChange={handleOnChange}
        />
      </div>
      {/* Submit button for the particular form */}
      <button
        onClick={handleSubmit}
        className="bg-secondary dark:bg-white dark:text-primary text-white px-1 rounded"
      >
        Add
      </button>
    </div>
  );
}
