import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectUserError,
  selectUserRequestStatus,
  loginUserThunk
} from '../../components/authorizationSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const loginUserError = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRequest = useSelector(selectUserRequestStatus);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  if (userRequest) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={loginUserError?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
