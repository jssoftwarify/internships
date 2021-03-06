import React from "react";
import "../styles/navbar-style.css";
import Navbar from "./layout-components/Navbar";

const NavbarLayout = (props) => {
  return <Navbar profile={props.profile}>{props.children}</Navbar>;
};
export default NavbarLayout;
