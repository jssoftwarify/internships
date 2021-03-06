import React from "react";
import { useAppContext } from "../../providers/ApplicationProvider";
import { Redirect } from "react-router";

const SignOutCallback = (props) => {
  const [{ userManager }] = useAppContext();
  userManager.signoutRedirectCallback();
  return <Redirect to="/internships" />;
};

export default SignOutCallback;
