import React from "react";
import "../styles/blank-style.css";
import { ReactComponent as Logo } from "../../assets/logo.svg";

const MessageLayout = (props) => {
  return (
      <div className="backgroundUN">
          <div className="ui inverted segment" style={{ paddingLeft: 0 }}>
        <div className="ui inverted secondary menu">
          <div className="item">
                      <Logo className="logo" style={{height: "50px"}}/>
          </div>
        </div>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default MessageLayout;
