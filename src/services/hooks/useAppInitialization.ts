import { useEffect } from 'react';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { authChecked, getUserThunk } from '../slices/authorizationSlice';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { AppDispatch } from '../store';

const useAppDispatch = () => useReduxDispatch<AppDispatch>();

export const useAppInitialization = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      dispatch(getUserThunk());
    } else {
      dispatch(authChecked());
    }
    dispatch(fetchIngredients());
  }, [dispatch]);
};
