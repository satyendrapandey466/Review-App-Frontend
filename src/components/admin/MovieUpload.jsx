import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import { useNotification } from "../../hooks";
import ModalContainer from "../models/ModalContainer";
import MovieForm from "./MovieForm";

//Component which will render the movie upload form.
export default function MovieUpload({ visible, onClose }) {
  //States for the movie upload
  const [videoSelected, setVideoSelected] = useState(false); //State managing that file is selected or not
  const [videoUploaded, setVideoUploaded] = useState(false); //State managing that file is uploaded or not
  const [uploadProgress, setUploadProgress] = useState(0); //State managing that file's upload progress
  const [videoInfo, setVideoInfo] = useState({}); //state managing the movie trailer upload details like public id and url
  const [busy, setBusy] = useState(false); //State managing the uploading status and renders button accordingly

  //Fetching function to provide error details
  const { updateNotification } = useNotification();

  //To reset the selected vedio states.
  const resetState = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setUploadProgress(0);
    setVideoInfo({});
  };

  //If type error happens then to handle it
  const handleTypeError = (error) => {
    updateNotification("error", error);
  };

  //Helper function to handle the trailer upload to the server
  const handleUploadTrailer = async (data) => {
    //Fetching the error or url and public id after successfull upload to the server and it will occur simultanously in the background
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    );
    if (error) return updateNotification("error", error);

    setVideoUploaded(true);
    //Uplaoad data to be updated in the state
    setVideoInfo({ url, public_id });
  };

  //Change in the file selector is handeled
  const handleChange = (file) => {
    const formData = new FormData(); //Creation of a new form data
    formData.append("video", file); //Appending file to the form data

    setVideoSelected(true);
    handleUploadTrailer(formData); //upload form to the server
  };

  //Progress value helper function it's instance is passed to the post function to get the actual percentage value
  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }

    return `Upload progress ${uploadProgress}%`;
  };

  //Helper function which handles the submit tequest and uploads the form data to backend api
  const handleSubmit = async (data) => {
    if (!videoInfo.url || !videoInfo.public_id)
      return updateNotification("error", "Trailer is missing!");

    setBusy(true);
    data.append("trailer", JSON.stringify(videoInfo)); //Appending the trailer innfo to the movieform data
    const { error, movie } = await uploadMovie(data); //Calling api with the form data to send to backend api
    setBusy(false);
    console.log(error,"error");
    console.log(movie,"movie");
    console.log(data,"data");
    if (error) return updateNotification("error", error);

    updateNotification("success", "Movie upload successfully.");
    resetState();
    //Closing the modal after upload
    onClose();
  };

  return (
    <ModalContainer visible={visible}>
      {/* Movie upload modal */}
      <div className="mb-5">
        <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
      </div>
      {/* If movie is not selected then movie trailer  upload form  is shown */}
      {!videoSelected ? (
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      ) : (
        //else movie form is shown
        <MovieForm busy={busy} onSubmit={!busy ? handleSubmit : null} />
      )}
    </ModalContainer>
  );
}

//This is the file selector in the movie
const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        <label className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col items-center justify-center dark:text-dark-subtle text-secondary cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p>Drop your file here!</p>
        </label>
      </FileUploader>
    </div>
  );
};

//This is the div which shows the upload progress meter
const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;

  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      {/*Wrapper div in which meter is placed */}
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        {/*Div which acts as meter */}
        <div /*Div which dyanamically gets width from uploadProgress and sets its width to fill meter to show upload progress*/
          style={{ width: width + "%" }}
          className="h-full absolute left-0 dark:bg-white bg-secondary"
        />
      </div>
      {/* Message for upload prgress */}
      <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
        {message}
      </p>
    </div>
  );
};
