import React, { useEffect, useState } from "react";
import { useNotification } from "../../hooks";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import { commonInputClasses } from "../../utils/theme";
import { validateMovie } from "../../utils/validator";
import DirectorSelector from "../DirectorSelector";
import CastForm from "../form/CastForm";
import Submit from "../form/Submit";
import GenresSelector from "../GenresSelector";
import Label from "../Label";
import LabelWithBadge from "../LabelWithBadge";
import CastModal from "../models/CastModal";
import GenresModal from "../models/GenresModal";
import WritersModal from "../models/WritersModal";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import TagsInput from "../TagsInput";
import ViewAllBtn from "../ViewAllButton";
import WriterSelector from "../WriterSelector";

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

//Common classes for the input field in movie form

//Component ewhich will handel form for the movie upload details
export default function MovieForm({ busy, btnTitle, initialState, onSubmit }) {
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo }); //state manages the movie details of form
  const [showWritersModal, setShowWritersModal] = useState(false); //state having the list of writers
  const [showCastModal, setShowCastModal] = useState(false); //state that handles the visibility state of casts
  const [selectedPosterForUI, setSelectedPosterForUI] = useState(""); //state that shows current poster which is selected
  const [showGenresModal, setShowGenresModal] = useState(false); //state that handles the visibility of genres selector modal

  const { updateNotification } = useNotification(); //error , warning or success message

  //Helper function to handle submit event on the whole form
  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);

    const { tags, genres, cast, writers, director, poster } = movieInfo;

    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,
    };


    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);
    //Constructing final cast array with only required details and then coverting JSON array
    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) finalMovieInfo.director = director.id;
    if (poster) finalMovieInfo.poster = poster;

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }

    console.log(movieInfo);
    onSubmit(formData);
  };

  //Helper function which handles the poster file upload by creating the  url of selected file
  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file); //creating an actual URL from the file object
    setSelectedPosterForUI(url); //setting state of selected poster ui to current selected file
  };

  //Handling change in input form and changing it into the actual form data
  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    //If file type is poster then update the posterUI state to current poster link.
    if (name === "poster") {
      const poster = files[0]; //getting poster details from file object provided by file selector
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  //setting the tags of movie into actual dataset
  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  //setting the director of movie into actual dataset
  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  //setting the casts of movie into actual dataset
  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  //setting the genres of movie into actual dataset
  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };
  

  //setting the writers of movie into actual dataset
  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      //If that writer is already selected show notification regardding it
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  //Handles the visibility of viewall writer modal
  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  //Handles the visibility of viewall casts modal

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  //Handles the visibility of genres selector modal

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  //Helper function which handles the removal of writer from the all writers array stored in actual form data
  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo; //fetch writer from the movie data
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) hideWritersModal(); //if writers array is empty hide the viewall modal
    setMovieInfo({ ...movieInfo, writers: [...newWriters] }); //commit the update in form data
  };

  //Helper function which handles the removal of casts from the all writers array stored in actual form data
  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releseDate: initialState.releseDate.split("T")[0],
        poster: null,
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState]);

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    releseDate,
    genres,
    type,
    language,
    status,
  } = movieInfo; //Destructure all the data from form and assign it as values to the respective form input

  return (
    <>
      {/* Form field which have two divs (Using div rather than form because form triggers submit action on every click on enter key)*/}
      <div onSubmit={handleSubmit} className="flex space-x-3">
        {/* Left div for the details regarding movie */}
        <div className="w-[70%] space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Titanic"
            />
          </div>

          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie storyline..."
            ></textarea>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            {/* dummy input field for tags */}
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>

          <DirectorSelector onSelect={updateDirector} />

          {/* This is where writers selection field is rendered  */}
          <div className="">
            <div className="flex justify-between">
              {/* Label which indicates the number of writers currently selected */}
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            {/* This live serch div for the writer field */}
            <WriterSelector onSelect={updateWriters} />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <input
            type="date"
            className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            onChange={handleChange}
            name="releseDate"
            value={releseDate}
          />

          <Submit
            busy={busy}
            value={btnTitle}
            onClick={handleSubmit}
            type="button"
          />
        </div>
        {/* Right div with details like poster genres etc */}
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            lable="Select poster"
            accept="image/jpg, image/jpeg, image/png"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />
          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>

      <WritersModal
        onClose={hideWritersModal}
        visible={showWritersModal}
        profiles={writers}
        onRemoveClick={handleWriterRemove}
      />

      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres}
      />
    </>
  );
}
