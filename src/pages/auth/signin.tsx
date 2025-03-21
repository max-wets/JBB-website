import Login from '../../components/auth/Login';
import LoginHeading from '../../components/auth/LoginHeading';
import { getCsrfToken } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import Head from 'next/head';

function SignInPage(props: { crsfToken }) {
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
  }, [displayAlert, error]);

  return (
    <>
      {' '}
      <Head>
        <title>Connexion - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Signin page"
        />
      </Head>
      {displayAlert ? <AlertMessage /> : null}
      <LoginHeading />
      <Login crsfToken={props.crsfToken} setError={setError} />
    </>
  );
}

export default SignInPage;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
