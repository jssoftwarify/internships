import React from "react";
import { useAppContext } from "../../providers/ApplicationProvider.js";
import "../styles/login-page-style.css";

const Login = () => {
  const [{ userManager }] = useAppContext();

  return (
    <div className="flexContainer">
      <div className="mainText">
        <h1>STUDENTSKÉ PRAXE</h1>
      </div>
      <div>
        <button
          className="ui brown button massive"
          onClick={() => {
            userManager.signinRedirect();
          }}
        >
          Přihlásit
        </button>
      </div>
    </div>
  );
};
export default Login;
