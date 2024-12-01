import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectCurrentUser } from '../../services/slices/authorizationSlice';
export const AppHeader: FC = () => {
  const userName = useSelector(selectCurrentUser)?.name;
  return <AppHeaderUI userName={userName} />;
};
