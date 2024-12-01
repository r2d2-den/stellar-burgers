import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '@ui';
import {
  fetchOrders,
  selectOrderRequestStatus,
  selectOrdersHistory
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersHistory);
  const dispatch = useDispatch();
  const token = localStorage.getItem('refreshToken');
  const orderRequest = useSelector(selectOrderRequestStatus);

  useEffect(() => {
    if (token) dispatch(fetchOrders());
  }, []);

  if (orderRequest) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
