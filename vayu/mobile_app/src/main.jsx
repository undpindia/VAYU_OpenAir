import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store.js';
import { registerSW } from 'virtual:pwa-register';

// const intervalMS = 24 * 60 * 60 * 1000;
const intervalMS = 60 * 60 * 1000;

if ('serviceWorker' in navigator) {
  registerSW({
    onRegistered(r) {
      r &&
        setInterval(() => {
          r.update();
        }, intervalMS);
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </React.StrictMode>
);
