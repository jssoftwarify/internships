import React from "react";
import { useAppContext } from "../../providers/ApplicationProvider";
import { Redirect } from "react-router";

const SilentRenew = (props) => {
  const [{ userManager }] = useAppContext();
  userManager.signinSilentCallback();
  return <Redirect to="/internships" />;
};

export default SilentRenew;
