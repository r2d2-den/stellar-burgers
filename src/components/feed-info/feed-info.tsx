import { useSelector } from '../../services/store';
import { FC } from 'react';
import { FeedInfoUI } from '../ui/feed-info/feed-info';
import { selectFeedData } from '../../services/slices/feedSlice';

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(selectFeedData);
  const readyOrders = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const pendingOrders = orders
    .filter((order) => order.status === 'pending')
    .map((order) => order.number);
  return (
    <FeedInfoUI
      feed={{ total, totalToday }}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
