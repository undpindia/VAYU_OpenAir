import { lazy } from 'react';

const HomePage = lazy(() => import('../components/Home/Home'));
const AssignedPage = lazy(() => import('../components/Assigned/Assigned'));
const DataCapturedPage = lazy(() =>
  import('../components/DataCaptured/DataCaptured')
);
const RecordDataPage = lazy(() =>
  import('../components/RecordData/RecordData')
);
const DataCapturedDetailsPage = lazy(() =>
  import('../components/DataCaptured/DataCapturedDetails')
);
const RecordLocationPage = lazy(() =>
  import('../components/RecordData/RecordLocation')
);

const NotificationPage = lazy(() =>
  import('../components/Notification/Notification')
);

const RecordDataSuccessPage = lazy(() =>
  import('../components/RecordData/RecordDataSuccess')
);

export const protectedRoutes = [
  { path: '/home', element: HomePage },
  {
    path: '/assigned',
    element: AssignedPage,
  },
  {
    path: '/data-captured',
    element: DataCapturedPage,
  },
  {
    path: '/record-data',
    element: RecordDataPage,
  },
  {
    path: '/data-captured-details',
    element: DataCapturedDetailsPage,
  },
  {
    path: '/record-location',
    element: RecordLocationPage,
  },
  {
    path: '/notification',
    element: NotificationPage,
  },
  {
    path: '/data-success',
    element: RecordDataSuccessPage,
  },
];
