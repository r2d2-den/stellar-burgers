import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';
import { useAppInitialization } from '../../services/hooks/useAppInitialization';
import { ProtectedRoute } from '../../services/protectedRoute/protectedRoute';

const App = () => {
  const { backgroundLocation, onClose } = useModalRouting();
  useAppInitialization();
  const renderProtectedModal = (path: string, children: React.ReactNode) => (
    <Route
      path={path}
      element={
        <ProtectedRoute>
          <Modal title='Информация о заказе' onClose={onClose}>
            {children}
          </Modal>
        </ProtectedRoute>
      }
    />
  );
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || useLocation()}>
        {appRoutes.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={onClose}>
                <OrderInfo />
              </Modal>
            }
          />
          {renderProtectedModal('/profile/orders/:number', <OrderInfo />)}
        </Routes>
      )}
    </div>
  );
};
export default App;

export const useModalRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const backgroundLocation = location.state?.background || null;

  const onClose = () => {
    navigate(backgroundLocation || '/');
  };

  return { backgroundLocation, onClose };
};

const appRoutes = [
  { path: '/', element: <ConstructorPage /> },
  { path: '/feed', element: <Feed /> },
  {
    path: '/login',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: (
      <ProtectedRoute onlyUnAuth>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ForgotPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/reset-password',
    element: (
      <ProtectedRoute onlyUnAuth>
        <ResetPassword />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/orders',
    element: (
      <ProtectedRoute>
        <ProfileOrders />
      </ProtectedRoute>
    )
  },
  { path: '/feed/:number', element: <OrderInfo /> },
  { path: '/ingredients/:id', element: <IngredientDetails /> },
  {
    path: '/profile/orders/:number',
    element: (
      <ProtectedRoute>
        <OrderInfo />
      </ProtectedRoute>
    )
  },
  { path: '*', element: <NotFound404 /> }
];
