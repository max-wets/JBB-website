import classes from './Login.module.css';
import Link from 'next/link';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';

interface Errors {
  [key: string]: unknown;
}

type SignUpProps = {
  setError: Dispatch<SetStateAction<string>>;
};

function Signup({ setError }: SignUpProps) {
  const router = useRouter();

  return (
    <div className={classes.container}>
      <div className={classes.contentarea}>
        <div className={classes.heading}>
          <h2>Inscription</h2>
        </div>
        <div className={classes.formwrap}>
          <Formik
            initialValues={{ username: '', email: '', password: '' }}
            validate={(values) => {
              const errors = {} as Errors;
              if (!values.email) {
                errors.email = 'Email obligatoire';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Adresse email non valide';
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
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`,
                  {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                  }
                );
                // console.log("res data:", data);
                setSubmitting(false);
                setError('');
                if (res.data.user) {
                  try {
                    const res = await signIn('credentials', {
                      redirect: false,
                      email: values.email,
                      password: values.password,
                      callbackUrl: `${window.location.origin}`,
                    });
                    if (res && res.url) router.push(res.url);
                  } catch (err) {
                    if (err instanceof Error && err.message) {
                      setError(err.message);
                    }
                    console.error(err);
                    throw new Error('Something wrong happened!');
                  }
                }
              } catch (err) {
                if (err instanceof AxiosError && err.response) {
                  const errMessage = err.response.data.error.message;
                  setError(errMessage);
                } else {
                  console.error(err);
                  throw new Error('Somethign wrong happend!');
                }
              }
            }}
          >
            {(formik) => (
              <Form>
                <p>
                  <label htmlFor="username">Pseudo</label>
                  <Field type="username" name="username" />
                  <ErrorMessage
                    name="username"
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
                <button type="submit">
                  {formik.isSubmitting ? 'Veuillez patienter...' : "S'inscrire"}
                </button>
                <p>
                  Déjà inscrit ?{' '}
                  <Link legacyBehavior href={`/login`}>
                    <a>Se connecter</a>
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
