import { useEffect } from 'react';
import { authChecked, getUserThunk } from '../slices/authorizationSlice';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { useDispatch, useSelector } from '../store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../slices/authorizationSlice';

export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    const token = localStorage.getItem('refreshToken');

    if (!isAuthChecked) {
      if (token) {
        dispatch(getUserThunk());
      } else {
        dispatch(authChecked());
      }
    }

    dispatch(fetchIngredients());
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
    }
  }, [isAuthChecked, isAuthenticated]);
};
