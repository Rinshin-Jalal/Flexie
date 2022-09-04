import React from "react";
import "./LoggedIn.scss";
import useUserStore from "../store/user";

const NotLoggedIn = () => {
  return (
    <div className="loggedIn login">
      <h2>You aren't logged in</h2>

      <a href="/">Go back to home</a>
      <a href="/login">Login</a>
    </div>
  );
};

export default NotLoggedIn;
