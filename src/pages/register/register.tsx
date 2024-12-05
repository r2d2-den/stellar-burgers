import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

import {
  registrationUser,
  selectUserError,
  selectUserRequestStatus
} from '../../services/slices/authorizationSlice';
import { useForm } from '../../services/hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    userName: ''
  });
  const registrationError = useSelector(selectUserError);
  const userRequest = useSelector(selectUserRequestStatus);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registrationUser({
        email: values.email,
        name: values.userName,
        password: values.password
      })
    );
  };

  if (userRequest) {
    return <Preloader />;
  }
  return (
    <RegisterUI
      errorText={registrationError?.message}
      email={values.email}
      password={values.password}
      userName={values.userName}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
