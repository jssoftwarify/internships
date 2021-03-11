import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider.js";

import axios from "axios";

import Loading from "../../Pages/Loading.js";
import Error from "../../messages/Error.js";
import Unauthorized from "../../messages/Unauthorized";

import { Container } from "reactstrap";
import NavbarItem from "./NavbarItem";
import Hamburger from "hamburger-react";

import "../../styles/navbar-style.css";

const Navbar = (props) => {
  const [{ userManager, profile, accessToken }] = useAppContext();
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (mounted) {
          response.data.data.forEach((item) => {
            if (item.email === profile.email) {
              axios
                .get(`${process.env.REACT_APP_API_URL}/api/Users/${item.id}`, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                  },
                })
                .then((response) => {
                  setUser(response.data);
                })
                .catch((error) => {
                  setError(true);
                });
            }
          });
        }
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
    return () => (mounted = false);
  }, [profile, accessToken]);

  function myFunction() {
    var x = document.getElementById("main");
    if (isOpen === true) {
      x.style.display = "none";
      setOpen(false);
    } else {
      x.style.display = "block";
      setOpen(true);
    }
  }
  function getUserNumber() {
    let array = [
      { number: 0 },
      {
        classroom: "",
        internship: "",
        specialization: "",
        address: "",
        telephoneNumber: "",
        birthDate: "",
      },
    ];

    if (!(user.classroomId != null)) {
      array[0].number = array[0].number + 1;
      array[1].classroom = "Chybí třída";
    }

    if (!(user.specializationId != null)) {
      array[0].number = array[0].number + 1;
      array[1].specialization = "Chybí obor";
    }
    if (!(user.addressId != null)) {
      array[0].number = array[0].number + 1;
      array[1].address = "Chybí adresa";
    }
    if (!(user.telephoneNumber != null)) {
      array[0].number = array[0].number + 1;
      array[1].telephoneNumber = "Chybí telefonní číslo";
    }
    var date = new Date(user.birthDate);
    if (date.getFullYear() === 1) {
      array[0].number = array[0].number + 1;
      array[1].birthDate = "Chybí datum narození";
    }
    return array;
  }

  if (error) {
    return <Error />;
  } else if (loading) {
    return <Loading />;
  } else {
    if (profile.hasOwnProperty("internship_administrator")) {
      return (
        <div id="app">
          <div className="main" id="main">
            <nav className="navigation">
              <ul>
                <NavbarItem
                  itemName="Praxe"
                  to="/Internships"
                  active={
                    props.active_item === "Internships" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Uživatele"
                  to="/Users"
                  active={props.active_item === "Users" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Obory"
                  to="/Specializations"
                  active={
                    props.active_item === "Specializations"
                      ? "visible"
                      : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Třídy"
                  to="/classrooms"
                  active={
                    props.active_item === "Classrooms" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Definice"
                  to="/definitions"
                  active={
                    props.active_item === "Definitions" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Firmy"
                  to="/companies"
                  active={
                    props.active_item === "Companies" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Mapa"
                  to="/map"
                  active={props.active_item === "Map" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Zlepšováky"
                  to="/improvements"
                  active={
                    props.active_item === "Improvements" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName={profile.given_name}
                  to="/accounts"
                  active={
                    props.active_item === "Accounts" ? "visible" : "hidden"
                  }
                />

                <li>
                  <p>
                    <button
                      className="logoutButton"
                      onClick={() => {
                        userManager.signoutRedirect();
                      }}
                    >
                      Odhlásit
                    </button>
                  </p>
                </li>
              </ul>
            </nav>
          </div>
          <div className="hamburger">
            <Hamburger
              color="white"
              toggled={isOpen}
              toggle={() => myFunction()}
            />
          </div>

          <div>{props.children}</div>
        </div>
      );
    } else if (profile.hasOwnProperty("internship_student")) {
      return (
        <div id="app">
          <div className="main" id="main">
            <nav className="navigation">
              <ul>
                <NavbarItem
                  itemName="Hlavní stránka"
                  to="/home"
                  active={props.active_item === "Home" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Praxe"
                  to="/Internships"
                  active={
                    props.active_item === "Internships" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Mapa"
                  to="/map"
                  active={props.active_item === "Map" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Deník"
                  to="/records"
                  active={props.active_item === "Denik" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Zlepšováky"
                  to="/improvements"
                  active={
                    props.active_item === "Improvements" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName={profile.given_name}
                  to="/accounts"
                  badgeNumber={user != null ? getUserNumber()[0].number : null}
                  badgeText={user != null ? getUserNumber()[1] : null}
                  active={
                    props.active_item === "Accounts" ? "visible" : "hidden"
                  }
                />
                <li>
                  <p>
                    <button
                      className="logoutButton"
                      onClick={() => {
                        userManager.signoutRedirect();
                      }}
                    >
                      Odhlásit
                    </button>
                  </p>
                </li>
              </ul>
            </nav>
          </div>
          <div className="hamburger">
            <Hamburger
              color="white"
              toggled={isOpen}
              toggle={() => myFunction()}
            />
          </div>
          <div>{props.children}</div>
        </div>
      );
    } else if (profile.hasOwnProperty("internship_controller")) {
      return (
        <div id="app">
          <div className="main" id="main">
            <nav className="navigation">
              <ul>
                <NavbarItem
                  itemName="Hlavní stránka"
                  to="/home"
                  active={props.active_item === "Home" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Praxe"
                  to="/Internships"
                  active={
                    props.active_item === "Internships" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName="Mapa"
                  to="/map"
                  active={props.active_item === "Map" ? "visible" : "hidden"}
                />
                <NavbarItem
                  itemName="Zlepšováky"
                  to="/improvements"
                  active={
                    props.active_item === "Improvements" ? "visible" : "hidden"
                  }
                />
                <NavbarItem
                  itemName={profile.given_name}
                  to="/accounts"
                  active={
                    props.active_item === "Accounts" ? "visible" : "hidden"
                  }
                />
                <li>
                  <p>
                    <button
                      className="logoutButton"
                      onClick={() => {
                        userManager.signoutRedirect();
                      }}
                    >
                      Odhlásit
                    </button>
                  </p>
                </li>
              </ul>
            </nav>
          </div>
          <div className="hamburger">
            <Hamburger
              color="white"
              toggled={isOpen}
              toggle={() => myFunction()}
            />
          </div>
          <div>{props.children}</div>
        </div>
      );
    } else {
      return (
        <Container>
          <Unauthorized />
        </Container>
      );
    }
  }
};

export default Navbar;
