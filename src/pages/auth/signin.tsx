import Login from '@/application/components/auth/Login';
import LoginHeading from '@/application/components/auth/LoginHeading';
import { getCsrfToken } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import Head from 'next/head';
import { CtxOrReq } from 'next-auth/client/_utils';

type SignInPageProps = {
  crsfToken?: string;
};

export default function SignInPage({ crsfToken }: SignInPageProps) {
  const [error, setError] = useState('');
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
        setError('');
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
      <Login crsfToken={crsfToken} setError={setError} />
    </>
  );
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
