import { lazy } from 'react';

const SigninPage = lazy(() => import('../components/Authentication/Signin'));
const SignupPage = lazy(() => import('../components/Authentication/Signup'));
const SignupSuccessPage = lazy(() =>
  import('../components/Authentication/SignupSuccess')
);
const ForgotPasswordPage = lazy(() => import('../components/Authentication/forgotPassword'));

export const publicRoutes = [
  { path: '/', element: SigninPage },
  {
    path: '/sign-up',
    element: SignupPage,
  },
  {
    path: '/sign-up-success',
    element: SignupSuccessPage,
  },
  {
    path: '/forgot-password',
    element: ForgotPasswordPage,
  },
];
