import i18next from 'i18next';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './app';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        error: {
          invalid: 'Invalid URL',
          network: 'Network error',
          duplicate: 'Feed URL has been already loaded',
        },
        success: {
          added: 'RSS has been loaded',
        },
      },
    },
  },
})
  .then(() => {
    app();
  });
