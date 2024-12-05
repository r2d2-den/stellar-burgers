import { Navigate, useLocation } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAuthChecked
} from '../slices/authorizationSlice';
import { Preloader } from '../../components/ui/preloader';
import { useSelector } from '../store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth,
  children
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectCurrentUser);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
