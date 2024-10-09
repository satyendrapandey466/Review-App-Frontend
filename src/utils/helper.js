//Helper function which validates the email
export const isValidEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return isValid.test(email);
};

//Helper function which fethes token from local storage
export const getToken = () => localStorage.getItem("auth-token");

//Helper function which handles the sync errors
export const catchError = (error) => {
  const { response } = error;
  if (response?.data) return response.data;

  return { error: error.message || error };
};

//This is helper function which renders or provide custom design to an item
export const renderItem = (result) => {
  return (
    <div className="flex rounded overflow-hidden">
      <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

export const getPoster = (posters = []) => {
  const { length } = posters;

  if (!length) return null;

  // if poster has more then 2 items then selecting second poster.
  if (length > 2) return posters[1];

  // other wise the first one
  return posters[0];
};

export const convertReviewCount = (count = 0) => {
  if (count <= 999) return count;

  return parseFloat(count / 1000).toFixed(2) + "k";
};
