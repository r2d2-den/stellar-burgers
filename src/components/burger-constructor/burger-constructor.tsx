import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  resetConstructorOrder,
  selectConstructorItems
} from '../../services/slices/constructorSlice';
import {
  createOrder,
  resetOrderData,
  selectOrderModalData,
  selectOrderRequestStatus
} from '../../services/slices/orderSlice';
import { selectCurrentUser } from '../../services/slices/authorizationSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderModalData = useSelector(selectOrderModalData);
  const orderRequest = useSelector(selectOrderRequestStatus);
  const user = useSelector(selectCurrentUser);
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const ingredientIds = [
        ...constructorItems.ingredients.map((ingredient) => ingredient._id),
        constructorItems.bun._id,
        constructorItems.bun._id
      ];
      dispatch(createOrder(ingredientIds));
    }
  };
  const closeOrderModal = () => {
    dispatch(resetConstructorOrder());
    dispatch(resetOrderData());
  };

  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);
  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData || null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
