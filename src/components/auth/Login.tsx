import classes from "./Login.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { signIn, getCsrfToken } from "next-auth/react";

interface Errors {
  [key: string]: any;
}

function Login({ crsfToken }) {
  const router = useRouter();
  const [error, setError] = useState(null);

  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.heading}>
          <h2>Connexion</h2>
        </div>
        <div className={classes.formwrap}>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: `${window.location.origin}`,
              });
              if (res?.error) {
                setError(res.error);
              } else {
                setError(null);
              }
              if (res.url) router.push(res.url);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <p>
                  <input
                    name="crsfToken"
                    type="hidden"
                    defaultValue={crsfToken}
                  />
                  <p>{error}</p>
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage name="email" component="div" />
                </p>
                <p>
                  <label htmlFor="password">Mot de passe</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password" component="div" />
                </p>
                <button type="submit">
                  {formik.isSubmitting
                    ? "Veuillez patienter..."
                    : "Se connecter"}
                </button>
                <p className={classes.lostpassword} style={{ width: "85%" }}>
                  <Link href={`/login/lost-password`}>
                    <a>Mot de passe oublié ?</a>
                  </Link>
                </p>
                <p>
                  Pas encore inscrit ?{" "}
                  <Link href={`/signup`}>
                    <a>S'enregistrer</a>
                  </Link>
                </p>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
