import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import axios from '../api/axios';
const ACTIVATE_ACCOUNT_URL = '/api/auth/account-activate';

export default function AccountActivation(props) {
  const [busy, setBusy] = useState(false);
  const [apiState, setApiState] = useState({
    success: false,
    error: false,
    errors: [],
  });
  console.log('props', props);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    // Get token from URL
    // eslint-disable-next-line no-restricted-globals
    const queryStringParams = queryString.parse(location.search) || {};
    const token = queryStringParams.token;

    if (!token) {
      setBusy(false);
      setApiState({
        success: false,
        error: true,
        errors: [],
      });

      return;
    }

    setBusy(true);

    axios
      .post(`${ACTIVATE_ACCOUNT_URL}/?token=${token}`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then(({data}) => {
        setBusy(false);
        if(data === "OK"){
          setApiState({
            success: true,
            error: false,
            errors: [],
          });
        }
        console.log('results ', data);
      })
      .catch((error) => {
        setBusy(false);
        setApiState({
          success: false,
          error: true,
          errors: error.errors,
        });
        console.log('error ', error);
      });
  }, []);

  const { success, error } = apiState;

  return (
    <>
      {busy ? <div>Activating Account ....</div> : null}
      {error && (
        <div>
          <Alert variant="danger">An error occurred. Perhaps you requested a new token?</Alert>
          <div>
            <Link to="/resend-activation-token">Request a new Activation Token</Link>
          </div>
        </div>
      )}
      {success && (
        <div>
          <Alert variant="success">
            Successfully activated your account. Please proceed to the Login page to Sign In
          </Alert>
          <div>
            <Link to="/login">Login</Link>
          </div>
        </div>
      )}
    </>
  );
}
