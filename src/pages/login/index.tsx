import Login from "../../components/auth/Login";
import LoginHeading from "../../components/auth/LoginHeading";
import { getCsrfToken } from "next-auth/react";
import Head from "next/head";

function LoginPage(props: { crsfToken }) {
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
      <Login crsfToken={props.crsfToken} setError={undefined} />
    </>
  );
}

export default LoginPage;

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
