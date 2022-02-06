import classes from "./Login.module.css";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";

interface Errors {
  [key: string]: any;
}

function Login({ crsfToken }) {
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
              const res = await fetch("/api/auth/callback/credentials", {
                method: "POST",
                body: JSON.stringify(values, null, 2),
              });
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2));
              //   setSubmitting(false);
              // }, 400);
              console.log(res);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <p>
                  <input
                    name="crsfToken"
                    type="hidden"
                    defaultValue={crsfToken}
                  />
                  <label htmlFor="email">Email</label>
                  <Field type="email" name="email" />
                  <ErrorMessage name="email" component="div" />
                </p>
                <p>
                  <label htmlFor="password">Mot de passe</label>
                  <Field type="password" name="password" />
                  <ErrorMessage name="password" component="div" />
                </p>
                <button type="submit" disabled={isSubmitting}>
                  Se connecter
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
