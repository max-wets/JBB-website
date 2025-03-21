import classes from './ResetPwd.module.css';
import { useRouter } from 'next/router';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import axios from 'axios';

interface Errors {
  [key: string]: unknown;
}

function ResetPwd({ setError, setSuccess }) {
  const router = useRouter();
  const { code } = router.query;

  // console.log(code);

  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.formwrap}>
          <p>Veuillez saisir votre nouveau mot de passe.</p>
          <Formik
            initialValues={{ password: '', confPassword: '' }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.password) {
                errors.password = 'Mot de passe obligatoire';
              }
              if (!values.confPassword) {
                errors.password = 'Confirmation de mot de passe obligatoire';
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
                  'Veuillez confirmer votre nouveau mot de passe avec une valeur de mot de passe similaire.'
                );
                setSubmitting(false);
              }
              try {
                await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
                  {
                    code: code,
                    password: values.password,
                    passwordConfirmation: values.confPassword,
                  }
                );
                setSubmitting(false);
                setSuccess(
                  'Votre nouveau mot de passe a bien été pris en compte !'
                );
                router.push('/login');
              } catch (err) {
                const errMessage = err.response.data.error.message;
                console.error('is error:', errMessage);
                if (errMessage === 'Passwords do not match') {
                  setError(
                    'Veuillez confirmer votre nouveau mot de passe avec une valeur de mot de passe similaire.'
                  );
                } else {
                  setError(errMessage);
                }
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
                <p>
                  <label htmlFor="confPassword">Confirmer mot de passe</label>
                  <Field type="password" name="confPassword" />
                  <ErrorMessage
                    name="confPassword"
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
                    : 'Changer mon mot de passe'}
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
