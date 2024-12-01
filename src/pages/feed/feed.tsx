import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TOrder } from '../../utils/types';
import {
  fetchAllFeeds,
  selectFeedOrders,
  selectFeedLoading,
  selectFeedError
} from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Загружаем данные при монтировании');
    dispatch(fetchAllFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    console.log('Кнопка нажата, обновляем данные');
    dispatch(fetchAllFeeds());
  };

  useEffect(() => {
    console.log('Текущие заказы:', orders);
  }, [orders]);

  if (loading) {
    return <Preloader />;
  }
  if (error) {
    return <div>Ошибка при загрузке: {error.message}</div>;
  }
  if (!orders.length) {
    return <Preloader />;
  }
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
