import { CtxOrReq } from 'next-auth/client/_utils';
import Login from '../../components/auth/Login';
import LoginHeading from '../../components/auth/LoginHeading';
import { getCsrfToken } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';

type LoginPageProps = {
  crsfToken?: string;
};

function LoginPage(props: LoginPageProps) {
  const [, setError] = useState('');

  return (
    <>
      <Head>
        <title>Connexion - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Login page"
        />
      </Head>
      <LoginHeading />
      <Login crsfToken={props.crsfToken} setError={setError} />
    </>
  );
}

export default LoginPage;

export const getServerSideProps = async (context: CtxOrReq | undefined) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};
