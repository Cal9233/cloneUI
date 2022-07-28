import Auth from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useEffect, useState } from "react";

const getCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch {
    // currentAuthenticatedUser throws an Error if not signed in
    return null;
  }
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<CognitoUser | null>(null);

  useEffect(() => {
    const updateUser = async () => {
      setCurrentUser(await getCurrentUser());
    };
    Hub.listen("auth", updateUser); // listen for login/signup events
    updateUser(); // check manually the first time because we won't get a Hub event
    return () => Hub.remove("auth", updateUser);
  }, []);

  const signOut = () => Auth.signOut();

  return { currentUser, signOut };
};

export default useAuth;

export { getCurrentUser };