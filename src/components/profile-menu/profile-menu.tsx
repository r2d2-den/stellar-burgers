import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { deleteCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/authorizationSlice';
export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    deleteCookie('accessToken');
    dispatch(logoutUser());
    navigate('/');
  };
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
