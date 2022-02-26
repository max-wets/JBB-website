import Signup from "../../components/auth/Signup";
import SignupHeading from "../../components/auth/SignupHeading";
import { useState, useEffect } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

function SignupPage() {
  const [error, setError] = useState(null);
  const [displayAlert, setDisplayAlert] = useState(false);

  function AlertMessage() {
    return (
      <Alert
        status="error"
        position="fixed"
        top="0"
        zIndex="99"
        justifyContent="space-between"
      >
        <AlertIcon />
        {error}
        <CloseButton
          position="relative"
          top="-6px"
          onClick={() => setDisplayAlert(false)}
        />
      </Alert>
    );
  }

  useEffect(() => {
    if (!displayAlert) {
      if (error) setDisplayAlert(true);
      setTimeout(() => {
        setError(null);
        setDisplayAlert(false);
      }, 5000);
    }
  }, [error]);

  return (
    <>
      {displayAlert ? <AlertMessage /> : null}
      <SignupHeading />
      <Signup setError={setError} />
    </>
  );
}

export default SignupPage;
