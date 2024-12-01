import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TOrder } from '../../utils/types';
import { fetchAllFeeds, selectFeedOrders } from '../../components/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchAllFeeds());
      }}
    />
  );
};
