import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

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

const Login = () => {
  const ctx = useContext(AuthContext);

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const emailInputRef = useRef();

  const passwordInputRef = useRef();

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('check form validity!');
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passwordState.isValid]);

  const emailChangeHandler = ({ target }) => dispatchEmail({ type: 'USER_INPUT', value: target.value });

  const passwordChangeHandler = ({ target }) => dispatchPassword({ type: 'USER_INPUT', value: target.value });

  const validateEmailHandler = () => dispatchEmail({ type: 'INPUT_BLUR' });

  const validatePasswordHandler = () => dispatchPassword({ type: 'INPUT_BLUR' });

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value);
    } else if (!emailState.isValid) {
      emailInputRef.current.focus();
    } else if (!passwordState.isValid) {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-mail"
          type="email"
          isValid={emailState.isValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordState.isValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
