import React, { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

//Component handling the actors upload data request
export default function ActorUpload({ visible, onClose }) {
  const [busy, setBusy] = useState(false);//state managing the upload status of the form data

  const { updateNotification } = useNotification();

  //Helper functio which handles the submit event.
  const handleSubmit = async (data) => {
    setBusy(true);//making button in busy syate and disabling it
    const { error, actor } = await createActor(data);//Uploading the form data to the backend api
    console.log(error,actor);
    setBusy(false);//Busy state to default
    if (error) return updateNotification("error", error);

    updateNotification("success", "Actor created successfully.");
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Create New Actor"
        btnTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  );
}
