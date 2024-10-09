import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";

//Creation of an context Api authcontext which have data as authInfo, handleLogin, handleLogout, isAuth
export const AuthContext = createContext();

//default authinfo value
const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

//Context provider
export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo }); //creating an authinfo state with default values
  const { updateNotification } = useNotification();

  const navigate = useNavigate();

  //Helper function which handles the login process
  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true }); //Setting the pending property to true in authinfo to provide information about user sign in process has started
    const { error, user } = await signInUser({ email, password }); //Sending post request to the api with data
    if (error) {
      //If error update notification with error 
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error }); //Error handling
    }

    //Successfully logged in navigate to home page
    navigate("/", { replace: true });
    //Setting the authinfo with actual data provided by api after successfull verification
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    updateNotification("success", "Login Successful");

    //Storing auth token intolocal storage int the local storage for the further use like auto signin
    localStorage.setItem("auth-token", user.token);
  };

  //Helper function which verifies whether any token is valid or not
  const isAuth = async () => {
    const token = localStorage.getItem("auth-token"); //Takes token prevviously stored iin local storage
    if (!token) return;

    setAuthInfo({ ...authInfo, isPending: true }); //authentication is pending
    const { error, user } = await getIsAuth(token); //sending get request to api to verify whther current token is valid or not and user details are provided by api
    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    // setting userifo provided by the api
    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });
  };

  //Handles the logout event clears the localstorage token and other signed in details
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  //To rerender the component every time when the isauth data is changed
  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, handleLogout, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
