import classes from "./LostPwd.module.css";
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
          <h2>Mot de passe perdu</h2>
        </div>
        <div className={classes.formwrap}>
          <p>
            Vous avez oublié votre mot de passe ? Veuillez entrer votre adresse
            email. Vous recevrez par mail un lien pour en créer un nouveau.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.email) {
                errors.email = "Email obligatoire";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Adresse mail non valide";
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
                <button type="submit" disabled={isSubmitting}>
                  Réinitialiser mon mot de passe
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Signup;
