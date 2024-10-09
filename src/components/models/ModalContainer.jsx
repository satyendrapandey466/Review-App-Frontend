import React from "react";

//This is the container which handles background modal 
export default function ModalContainer({
  visible,//controls the visibility of the modal
  ignoreContainer,//ignore the vontainer modal and only render backdrop
  children,
  onClose,//close the modal
}) {
  //Helper function which handles the click on the modal and if it is not conatiner div then closes the modal
  const handleClick = (e) => {
    if (e.target.id === "modal-container") onClose && onClose();
  };

  //helper function which renders children into backdrop directly if ignorecontainer is passed else into a fixed size container
  const renderChildren = () => {
    if (ignoreContainer) return children;

    return (
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {children}
      </div>
    );
  };

  if (!visible) return null;
  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      {renderChildren()}
    </div>
  );
}
