import React from "react";

//common class for poster selector input field
const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

  //component which handles the POster selector input field
export default function PosterSelector({
  name,//name of the input field
  accept,//type of files it accepts
  selectedPoster,//what to be displayed as front
  lable,//Lable to be shown
  className,//custom classes to be applied
  onChange,//change handler which will be triggered when file is selected

}) {
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {/* if some file was already slected show that image else render an icon */}
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-cover " + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI className={className} label={lable} />
        )}
      </label>
    </div>
  );
}

const PosterUI = ({ label, className }) => {
  return (
    <div className={commonPosterUI + " " + className}>
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};
