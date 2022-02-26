import classes from "./LostPwd.module.css";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import axios from "axios";

interface Errors {
  [key: string]: any;
}

function Signup({ setError }) {
  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
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
            onSubmit={async (values, { setSubmitting }) => {
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2));
              //   setSubmitting(false);
              // }, 400);
              try {
                const res = await axios.post(
                  "https://jbbeauty-cms.herokuapp.com/api/auth/forgot-password",
                  {
                    email: values.email,
                  }
                );
                const data = res.data;
                if (res.data) console.log(data);
                setSubmitting(false);
              } catch (err) {
                const errMessage = err.response.data.error.message;
                console.error("is error:", errMessage);
                setError(errMessage);
              }
            }}
          >
            {(formik) => (
              <Form>
                <p>
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
                <button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting
                    ? "Veuillez patienter..."
                    : "Réinitialiser mon mot de passe"}
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
