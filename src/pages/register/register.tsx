import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  registrationUser,
  selectUserError,
  selectUserRequestStatus
} from '../../services/slices/authorizationSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const registrationError = useSelector(selectUserError);
  const userRequest = useSelector(selectUserRequestStatus);
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registrationUser({ email, name: userName, password }));
  };

  if (userRequest) {
    return <Preloader />;
  }
  return (
    <RegisterUI
      errorText={registrationError?.message}
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
