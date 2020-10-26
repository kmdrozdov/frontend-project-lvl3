import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import onChange from 'on-change';
import { string } from 'yup';

import parseRss from './parseRss';
import { renderFeedInfo, renderFormState } from './view';

const makeRequest = (url) => (
  axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
    headers: {
      'X-Requested-With': null,
    },
  })
);

const app = () => {
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
      const state = {
        form: {
          data: {
            rssLink: '',
          },
          state: 'empty',
          error: '',
        },
        feeds: [],
      };

      const watchedState = onChange(state, (path) => {
        if (path.startsWith('form')) {
          renderFormState(state);
        }

        if (path.startsWith('feeds')) {
          renderFeedInfo(state);
        }
      });

      const form = document.querySelector('form');

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const rssLink = data.get('rssLink');

        watchedState.form.data.rssLink = rssLink;

        const updateRssFeed = (feedLink) => {
          makeRequest(feedLink)
            .then((resp) => {
              const { items } = parseRss(resp.data);
              const currentFeed = watchedState.feeds.find(({ link }) => link === feedLink);
              const filteredData = _.differenceBy(items, currentFeed.items, 'guid');

              currentFeed.items.push(...filteredData);

              setTimeout(() => {
                updateRssFeed(feedLink);
              }, 5000);
            });
        };

        const addedFeedsLinks = watchedState.feeds.map(({ link }) => link);
        const validator = string()
          .url(i18next.t('error.invalid'))
          .notOneOf(addedFeedsLinks, i18next.t('error.duplicate'));

        validator.validate(rssLink)
          .then((link) => {
            watchedState.form.state = 'sending';

            return makeRequest(link)
              .then((resp) => {
                watchedState.feeds.push({
                  link,
                  ...parseRss(resp.data),
                });

                watchedState.form = {
                  ...watchedState.form,
                  data: {
                    rssLink: '',
                  },
                  error: '',
                  state: 'done',
                };

                setTimeout(() => {
                  updateRssFeed(link);
                }, 5000);
              })
              .catch(() => {
                throw new Error(i18next.t('error.network'));
              });
          })
          .catch((error) => {
            watchedState.form = {
              ...watchedState.form,
              state: 'invalid',
              error: error.message,
            };
          });
      });
    });
};

export default app;
