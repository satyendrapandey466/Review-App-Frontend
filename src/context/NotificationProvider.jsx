import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

//Timeout id for settimeout timer which will handle the notification 
let timeoutId;

//Helper component which provides acces to the Notification context api 
export default function NotificationProvider({ children }) {
  const [notification, setNotification] = useState("");//Notification state stores message to be shown
  const [classes, setClasses] = useState("");//classes to be applied for different types of notification

  const updateNotification = (type, value) => {
    if (timeoutId) clearTimeout(timeoutId);//For ech click reset the timer to zero again

    //Case to change the classes for each different type of messages
    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;
      case "success":
        setClasses("bg-green-500");
        break;
      case "warning":
        setClasses("bg-orange-500");
        break;
      default:
        setClasses("bg-red-500");
    }
    //Updating the notification messages
    setNotification(value);

    //Timer to auto reset the notification timer after 3 seconds
    timeoutId = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24 ">
          <div className="bounce-custom shadow-md shadow-gray-400 rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold"}>
              {notification}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
