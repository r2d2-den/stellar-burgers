import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';
import {
  loginUserThunk,
  selectIsAuthenticated,
  selectUserError,
  selectUserRequestStatus
} from '../../services/slices/authorizationSlice';
import { useForm } from '../../services/hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({ email: '', password: '' });

  const dispatch = useDispatch();
  const loginUserError = useSelector(selectUserError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRequest = useSelector(selectUserRequestStatus);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk(values));
  };

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }
  if (userRequest) {
    return <Preloader />;
  }
  return (
    <LoginUI
      errorText={loginUserError?.message}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
