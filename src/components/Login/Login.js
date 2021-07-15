import React, { useReducer, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const emailReducer = ({ value }, { type, value: newValue }) => {
  switch (type) {
    case 'USER_INPUT':
      return { value: newValue, isValid: newValue.includes('@') };
    case 'INPUT_BLUR':
      return { value, isValid: value.includes('@') };
    default:
      return { value: '', isValid: false };
  }
};

const passwordReducer = ({ value }, { type, value: newValue }) => {
  switch (type) {
    case 'USER_INPUT':
      return { value: newValue, isValid: newValue.trim().length > 6 };
    case 'INPUT_BLUR':
      return { value, isValid: value.trim().length > 6 };
    default:
      return { value: '', isValid: false };
  }
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const emailChangeHandler = ({ target }) => {
    dispatchEmail({ type: 'USER_INPUT', value: target.value });

    setFormIsValid(
      target.value.includes('@') && passwordState.value.trim().length > 6
    );
  };

  const passwordChangeHandler = ({ target }) => {
    dispatchPassword({ type: 'USER_INPUT', value: target.value });

    setFormIsValid(
      emailState.value.includes('@') && target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
