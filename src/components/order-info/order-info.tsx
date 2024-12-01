import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import {
  fetchOrderNumber,
  selectOrderNumber
} from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const dispatch = useDispatch();
  const orderData = useSelector(selectOrderNumber);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderNumber(Number(number)));
    }
  }, [dispatch, number]);
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsMap = ingredients.reduce(
      (acc, item) => {
        acc[item._id] = item;
        return acc;
      },
      {} as Record<string, TIngredient>
    );

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc, item) => {
        const ingredient = ingredientsMap[item];
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }
  return <OrderInfoUI orderInfo={orderInfo} />;
};
