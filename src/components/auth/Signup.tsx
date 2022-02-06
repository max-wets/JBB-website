import classes from "./Login.module.css";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";

interface Errors {
  [key: string]: any;
}

function Signup() {
  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.heading}>
          <h2>Inscription</h2>
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
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <p>
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
                  S'inscrire
                </button>
                <p>
                  Déjà inscrit ?{" "}
                  <Link href={`/login`}>
                    <a> Se connecter</a>
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

export default Signup;
