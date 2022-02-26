import classes from "./ResetPwd.module.css";
import Link from "next/link";
import { Field, Form, Formik, ErrorMessage } from "formik";
import axios from "axios";

interface Errors {
  [key: string]: any;
}

function ResetPwd({ setError }) {
  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.formwrap}>
          <p>Veuillez saisir votre nouveau mot de passe.</p>
          <Formik
            initialValues={{ password: "", confPassword: "" }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.password) {
                errors.password = "Mot de passe obligatoire";
              } else if (!values.confPassword) {
                errors.password = "Confirmation de mot de passe obligatoire";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2));
              //   setSubmitting(false);
              // }, 400);
              if (values.password !== values.confPassword) {
                setError(
                  "Veuillez confirmer votre nouveau mot de passe avec une valeur de mot de passe similaire."
                );
                setSubmitting(false);
              }
              try {
                const res = await axios.post(
                  "https://jbbeauty-cms.herokuapp.com/api/auth/forgot-password",
                  {
                    password: values.password,
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
                <p>
                  <label htmlFor="password">Confirmer mot de passe</label>
                  <Field type="password" name="confirm-password" />
                  <ErrorMessage
                    name="confirm-password"
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
                    : "Changer mon mot de passe"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ResetPwd;
