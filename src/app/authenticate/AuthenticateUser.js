// !!! TODO: Add input sanitization

import React from 'react';
import { connect } from 'react-redux';
import { setUser } from '@/redux/user-slice';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { redirect } from 'next/navigation';

const AuthenticateUser = ({ form, setUser }) => {
  const forms = {
    login:    <LoginForm setUser={setUser} />,
    register: <RegisterForm setUser={setUser}  />
  };

  if (forms[form] === undefined) {
    redirect("/authenticate/login");
  }

  return forms[form]
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps, { setUser })(AuthenticateUser);