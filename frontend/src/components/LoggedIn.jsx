import React from "react";
import "./LoggedIn.scss";
import useUserStore from "../store/user";

const LoggedIn = () => {
  const logout = useUserStore((state) => state.logout);
  return (
    <div className="loggedIn login">
      <h2>Already logged in</h2>

      <p>
        Now you can use the app. Try to chat with somebody with the same
        interests as you.
      </p>
      <a href="/">Go back to home</a>

      <button className="logout" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

export default LoggedIn;
