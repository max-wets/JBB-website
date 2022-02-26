import classes from "./Login.module.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { signIn, getCsrfToken } from "next-auth/react";

interface Errors {
  [key: string]: any;
}

function Login({ crsfToken, setError }) {
  const router = useRouter();

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
                errors.email = "Email obligatoire";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Adresse email non valide";
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
                if (!res.ok)
                  setError(
                    "Email et/ou mot de passe non valide(s). Veuillez réessayer."
                  );
              } else {
                if (res.url) router.push(res.url);
                setError(null);
                setSubmitting(false);
              }
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
                  {/* <p>{error}</p> */}
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <div
                        style={{
                          color: "red",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      >
                        {msg + " !"}
                      </div>
                    )}
                  />
                </p>
                <p>
                  <label htmlFor="password">Mot de passe</label>
                  <Field type="password" name="password" />
                  <ErrorMessage
                    name="password"
                    render={(msg) => (
                      <div
                        style={{
                          color: "red",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      >
                        {msg + " !"}
                      </div>
                    )}
                  />
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
