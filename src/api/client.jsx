import axios from "axios";

//Using axios library for http request to the api

//Creating a cliet with a base URL
const client = axios.create({
  baseURL: "https://one0starreviewapi.onrender.com/api",
});

export default client;
