import React, { useEffect, useState } from "react";
import { useAppContext } from "../../providers/ApplicationProvider";
import { Redirect } from "react-router";

import axios from "axios";

import Loading from "../Pages/Loading";
import Error from "../messages/Error.js";

const SignInCallback = () => {
  const [{ userManager, accessToken, profile }, dispatch] = useAppContext();
  const [allOk, setAllOk] = useState(true);
  const [put, setPut] = useState(false);
  const [post, setPost] = useState(false);
  const [signResult, setSignResult] = useState();
  const [item, setItem] = useState();

  useEffect(() => {
    (async () => {
      /*
      if (profile == null || profile == undefined) {
        window.history.replaceState(
          {},
          window.document.title,
          window.location.origin + window.location.pathname
        );
        window.location = "/";
      }
      */
      const result = userManager
        ? await userManager.signinRedirectCallback()
        : null;
      if (result) {
        let temp = true;
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/Users`)
          .then((response) => {
            response.data.data.forEach((item) => {
              if (item.email === result.profile.email) {
                setPut(true);
                setItem(item);
                temp = false;
              }
            });
          })
          .catch((error) => {
            setAllOk(false);
          })
          .then(() => {
            if (temp) {
              setPost(true);
            }
            setSignResult(result);
          });
      }
    })();
  }, [userManager, dispatch]);

  const postUser = (signResult) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/Users`,
        {
          FirstName: signResult.profile.given_name,
          LastName: signResult.profile.family_name,
          Gender:
            signResult.profile.Gender === "Male"
              ? 0
              : signResult.profile.Gender === "Female"
              ? 1
              : 2,
          Email: signResult.profile.email,
          Controller: profile.hasOwnProperty("internship_controller")
            ? true
            : false,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setAllOk(true);
      })
      .catch((error) => {
        setAllOk(false);
      })
      .then(() => {});
  };
  const putUser = (item, signResult) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/Users/${item.id}`,
        {
          FirstName: signResult.profile.given_name,
          LastName: signResult.profile.family_name,
          Gender:
            signResult.profile.Gender === "Male"
              ? 0
              : signResult.profile.Gender === "Female"
              ? 1
              : 2,
          Email: signResult.profile.email,
          Controller: profile.hasOwnProperty("internship_controller")
            ? true
            : false,
          ClassroomId: item.classroomId,
          Address: item.address,
          SpecializationId: item.specializationId,
          TelephoneNumber: item.telephoneNumber,
          BirthDate: item.birthDate,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        setAllOk(false);
      })
      .then(() => {});
  };
  if (allOk && profile && signResult) {
    if (put) {
      putUser(item, signResult);
      if (profile.hasOwnProperty("internship_administrator")) {
        return <Redirect to="/internships" />;
      } else if (profile.hasOwnProperty("internship_student")) {
        return <Redirect to="/home" />;
      } else {
        return <Redirect to="/accounts" />;
      }
    }
    if (post) {
      postUser(signResult);
      if (profile.hasOwnProperty("internship_administrator")) {
        return <Redirect to="/internships" />;
      } else if (profile.hasOwnProperty("internship_student")) {
        return <Redirect to="/home" />;
      } else {
        return <Redirect to="/accounts" />;
      }
    }
  } else if (!allOk) {
    return <Error />;
  } else {
    return <Loading />;
  }
};

export default SignInCallback;
