import ResetPwd from '../../../components/auth/ResetPwd';
import ResetPwdHeading from '../../../components/auth/LostPwdHeading';
import { useState, useEffect } from 'react';
import { Alert, AlertIcon, CloseButton } from '@chakra-ui/react';
import Head from 'next/head';

function ResetPwdPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayAlert, setDisplayAlert] = useState(false);

  function AlertMessage() {
    return (
      <Alert
        status={error ? 'error' : 'success'}
        position="fixed"
        top="0"
        zIndex="99"
        justifyContent="space-between"
      >
        <AlertIcon />
        {error ? error : success}
        <CloseButton
          position="relative"
          top="-6px"
          onClick={() => setDisplayAlert(false)}
        />
      </Alert>
    );
  }

  useEffect(() => {
    if (!displayAlert) {
      if (error) setDisplayAlert(true);
      setTimeout(() => {
        setError('');
        setDisplayAlert(false);
      }, 5000);
    }
  }, [displayAlert, error]);

  useEffect(() => {
    if (!displayAlert) {
      if (success) setDisplayAlert(true);
      setTimeout(() => {
        setSuccess('');
        setDisplayAlert(false);
      }, 5000);
    }
  }, [displayAlert, success]);

  return (
    <>
      <Head>
        <title>Changement de mot de passe - JBBeauty</title>
        <meta
          name="description"
          content="Meta description for the Reset password page"
        />
      </Head>
      {displayAlert ? <AlertMessage /> : null}
      <ResetPwdHeading />
      <ResetPwd setError={setError} setSuccess={setSuccess} />
    </>
  );
}

export default ResetPwdPage;
