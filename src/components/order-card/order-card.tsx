import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsMap = ingredients.reduce(
      (acc, item) => {
        acc[item._id] = item;
        return acc;
      },
      {} as Record<string, TIngredient>
    );

    const ingredientsInfo = order.ingredients.reduce<TIngredient[]>(
      (acc, item) => {
        const ingredient = ingredientsMap[item];
        if (ingredient) acc.push(ingredient);
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);
    const remains =
      ingredientsInfo.length > MAX_INGREDIENTS
        ? ingredientsInfo.length - MAX_INGREDIENTS
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
