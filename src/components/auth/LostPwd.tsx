import classes from './LostPwd.module.css';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';

interface Errors {
  [key: string]: unknown;
}

type LostPwdProps = {
  setError: Dispatch<SetStateAction<string>>;
  setSuccess: Dispatch<SetStateAction<string>>;
};

export default function LostPwd({ setError, setSuccess }: LostPwdProps) {
  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.formwrap}>
          <p>
            Vous avez oublié votre mot de passe ? Veuillez entrer votre adresse
            email. Vous recevrez par mail un lien pour en créer un nouveau.
          </p>
          <Formik
            initialValues={{ email: '' }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.email) {
                errors.email = 'Email obligatoire';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Adresse mail non valide';
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
                  {
                    email: values.email,
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json; charset=utf-8',
                      'Access-Control-Allow-Origin': '*',
                    },
                  }
                );
                setSubmitting(false);
                setSuccess('Un email vous a été envoyé !');
              } catch (err) {
                if (err instanceof AxiosError && err.response) {
                  const errMessage = err.response.data.error.message;
                  setError(errMessage);
                }
                console.error(err);
                throw new Error('Something wrong happened!');
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
                          color: 'red',
                          fontWeight: '700',
                          fontSize: '14px',
                        }}
                      >
                        {msg + ' !'}
                      </div>
                    )}
                  />
                </p>
                <button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting
                    ? 'Veuillez patienter...'
                    : 'Réinitialiser mon mot de passe'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
