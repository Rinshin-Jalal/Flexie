import React from "react";
import "./Nav.scss";
import useUserStore from "../store/user";

const Nav = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  return (
    <nav>
      <div className="left">
        <a href="/">
          <img className="logo" src="/logo.png" alt="Flexie" />
          <h2>Flexie</h2>
        </a>
      </div>
      <div className="nav-links">
        <a href="/">Home</a>
        {isLoggedIn ? <a href="/chat">Chat</a> : <a href="/login">Login</a>}
      </div>
    </nav>
  );
};

export default Nav;
