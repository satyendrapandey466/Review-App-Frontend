import { catchError, getToken } from "../utils/helper";
import client from "./client";
//This is helper function that request api to cretae an actor with the provided formData
export const createActor = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/create", formData, {
      headers: {
        //Providing the token of authentic user
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data", //Because multimedia data is also cantained in the form
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//This is a helper function used to update the actors details
export const updateActor = async (id, formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/actor/update/" + id, formData, {
      //Requesting update to backend with updateid and data
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};


//This is helper function handles the delete request to backend for an actor with provided id
export const deleteActor = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete("/actor/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

///This is helper function used to search an actor via some test as query parameter
export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};


// Helper function which fetches actors from backend with pagination support
export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    const { data } = await client(
      `/actor/actors?pageNo=${pageNo}&limit=${limit}`, //Providing the required paramaters as query inputs
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Helper function which provides the user profiles via id
export const getActorProfile = async (id) => {
  try {
    const { data } = await client(`/actor/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
