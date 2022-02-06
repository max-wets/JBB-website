import Login from "../../components/auth/Login";
import LoginHeading from "../../components/auth/LoginHeading";
import { getCsrfToken } from "next-auth/react";

function SignInPage(props: { crsfToken }) {
  return (
    <>
      <LoginHeading />
      <Login crsfToken={props.crsfToken} />
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
