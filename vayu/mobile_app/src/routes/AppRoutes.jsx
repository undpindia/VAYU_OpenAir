import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
// import Signin from '../components/Authentication/Signin';
// import Home from '../components/Home/Home';
import { protectedRoutes } from './ProtectedRoutes';
import Layout from '../components/UI/Layout/Layout';
import { PrivateRoute, PublicRoute } from './routing';
import { publicRoutes } from './PublicRoutes';

const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route element={<Layout />}>
          {protectedRoutes.map((route, index) => {
            return (
              <Route
                path={route?.path}
                element={
                  <PrivateRoute>
                    <route.element />
                  </PrivateRoute>
                }
                key={index}
              />
            );
          })}
        </Route>
        {publicRoutes.map((route, index) => {
          return (
            <Route
              path={route?.path}
              element={
                <PublicRoute>
                  <route.element />
                </PublicRoute>
              }
              key={index}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
