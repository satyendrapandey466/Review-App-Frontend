import React, { useEffect, useState } from "react";
import genres from "../../utils/genres";
import Submit from "../form/Submit";
import ModalContainer from "./ModalContainer";

// This component handles the genres selection modal
export default function GenresModal({
  visible, //sets the visibility of the modal
  previousSelection, //value which are already selected
  onClose, //sets the visibility to the false
  onSubmit, //Function which handles the onsubmit event (expect array of selected genres)
}) {
  const [selectedGenres, setSelectedGenres] = useState([]); //state that manges genres which are selected right noww

  //This is helper function which manages the genres which are selected if slected genre is already in selectedgenres then filter it out else put it in
  const handleGenresSelector = (gen) => {
    let newGenres = [];

    //If already selected filter it out
    if (selectedGenres.includes(gen))
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    else newGenres = [...selectedGenres, gen]; //else put it in

    setSelectedGenres([...newGenres]);
    console.log(selectedGenres,"Hell ") ;
  };

  //when submit button is pressed close the modal
  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  //when close modal is triggered reset the current selections with previous selctions
  const handleClose = () => {
    setSelectedGenres(previousSelection);
    onClose();
  };

  //set the current genres state to the previous genres provided in prop which is value i.e. already in movieInfo
  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>
          {/* map all the genres */}
          <div className="space-y-3">
            {genres.map((gen) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  selected={selectedGenres.includes(gen)}
                  key={gen}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>

        <div className="w-56 self-end">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

//Component which handles the each Genre
const Genre = ({ children, selected, onClick }) => {
  //styled to be applied when the genres is in selected state and deselected state
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "text-primary dark:text-white";
  };

  return (
    <button
      onClick={onClick}
      className={//styles injected on the basisi of selection state
        getSelectedStyle() +
        " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
