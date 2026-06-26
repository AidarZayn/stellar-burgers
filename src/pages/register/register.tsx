import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  getUserLoading,
  getError
} from '../../services/slices/user';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(getUserLoading);
  const textError = useSelector(getError);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({ name: userName, email, password })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={textError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
