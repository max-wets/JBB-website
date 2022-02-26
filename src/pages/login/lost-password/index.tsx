import LostPwd from "../../../components/auth/LostPwd";
import LostPwdHeading from "../../../components/auth/LostPwdHeading";
import { useState, useEffect } from "react";
import { Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

function LostPwdPage() {
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
      <LostPwdHeading />
      <LostPwd setError={setError} />
    </>
  );
}

export default LostPwdPage;
