import LostPwd from "../../../components/auth/LostPwd";
import LostPwdHeading from "../../../components/auth/LostPwdHeading";
import { useState, useEffect } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";
import Head from "next/head";

function LostPwdPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [displayAlert, setDisplayAlert] = useState(false);

  function AlertMessage() {
    return (
      <Alert
        status={error ? "error" : "success"}
        position="fixed"
        top="0"
        zIndex="99"
        justifyContent="space-between"
      >
        <AlertIcon />
        {error ? error : success}
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

  useEffect(() => {
    if (!displayAlert) {
      if (success) setDisplayAlert(true);
      setTimeout(() => {
        setSuccess(null);
        setDisplayAlert(false);
      }, 5000);
    }
  }, [success]);

  return (
    <>
      <Head>
        <title>Mot de passe perdu - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Lost password page"
        />
      </Head>
      {displayAlert ? <AlertMessage /> : null}
      <LostPwdHeading />
      <LostPwd setError={setError} setSuccess={setSuccess} />
    </>
  );
}

export default LostPwdPage;
