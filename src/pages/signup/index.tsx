import Signup from "../../components/auth/Signup";
import SignupHeading from "../../components/auth/SignupHeading";
import { useState, useEffect } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";
import Head from "next/head";

function SignupPage() {
  const [error, setError] = useState(null);
  const [displayAlert, setDisplayAlert] = useState(false);

  function AlertMessage() {
    return (
      <>
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
      </>
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
      <Head>
        <title>Inscription - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Signup page"
        />
      </Head>
      {displayAlert ? <AlertMessage /> : null}
      <SignupHeading />
      <Signup setError={setError} />
    </>
  );
}

export default SignupPage;
