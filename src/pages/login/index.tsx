import Login from "../../components/auth/Login";
import LoginHeading from "../../components/auth/LoginHeading";
import { getCsrfToken } from "next-auth/react";

function LoginPage(props: { crsfToken }) {
  return (
    <>
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
