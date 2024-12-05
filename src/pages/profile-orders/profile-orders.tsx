import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  fetchOrders,
  resetOrderData,
  selectOrderRequestStatus,
  selectOrdersHistory
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersHistory);
  const dispatch = useDispatch();
  const token = localStorage.getItem('refreshToken');
  const orderRequest = useSelector(selectOrderRequestStatus);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrders());
    }
    return () => {
      dispatch(resetOrderData());
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (!orderRequest && orders.length > 0) {
      setLoading(false);
    }
  }, [orderRequest, orders]);

  if (loading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <div>У вас нет заказов.</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
