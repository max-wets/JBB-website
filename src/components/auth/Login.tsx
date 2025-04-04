import classes from "./Login.module.css";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Field, Formik, ErrorMessage } from "formik";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface Errors {
  [key: string]: unknown;
}

type LoginProps = {
  crsfToken?: string;
  setError: Dispatch<SetStateAction<string>>;
};

export default function Login({ crsfToken, setError }: LoginProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const previousPath = useRef("");

  useEffect(() => {
    router.prefetch("/");
    if (previousPath.current) router.prefetch(previousPath.current);
  }, [router]);

  useEffect(() => {
    // console.log("previous path:", previousPath.current);
    const prevPath = globalThis.sessionStorage.getItem("prevPath");
    if (prevPath) {
      previousPath.current = prevPath;
    }
  }, [router.asPath]);

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
              if (session) signOut({ redirect: false });
              const callbackUrl =
                `${window.location.origin}` + previousPath.current;

              const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: callbackUrl,
              });

              if (res && !res.ok) {
                if (res.error)
                  setError(
                    "Email et/ou mot de passe non valide(s). Veuillez réessayer.",
                  );
              } else if (res) {
                // console.log(callbackUrl);
                if (res.url) router.push(callbackUrl);
                setError("");
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
                  <Link legacyBehavior href={`/login/lost-password`}>
                    <a>Mot de passe oublié ?</a>
                  </Link>
                </p>
                <p>
                  Pas encore inscrit ?{" "}
                  <Link legacyBehavior href={`/signup`}>
                    <a>S&apos;enregistrer</a>
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
