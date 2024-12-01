import { useEffect } from 'react';
import { useDispatch } from './../services/store';
import { authChecked, getUserThunk } from './../components/authorizationSlice';
import { fetchIngredients } from './../components/ingredientsSlice';

export const useAppInitialization = () => {
  const dispatch = useDispatch();

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
