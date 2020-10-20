import axios from 'axios';
import i18next from 'i18next';
import onChange from 'on-change';
import { string } from 'yup';

import parseRss from './parseRss';
import { renderFeedInfo, renderFormState } from './view';

const validator = string().url();

const makeRequest = (url) => (
  axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
    headers: {
      'X-Requested-With': null,
    },
  })
);

const app = () => {
  const state = {
    form: {
      data: {
        rssLink: '',
      },
      state: 'empty',
      error: '',
    },
    feeds: {},
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
          const filteredData = items.filter(
            (item) => !watchedState.feeds[feedLink].items.some((post) => post.guid === item.guid),
          );

          watchedState.feeds[feedLink].items = [
            ...watchedState.feeds[feedLink].items,
            ...filteredData,
          ];

          setTimeout(() => {
            updateRssFeed(feedLink);
          }, 5000);
        });
    };

    validator.isValid(rssLink)
      .then((res) => {
        if (!res) {
          throw new Error(i18next.t('error.invalid'));
        }

        return rssLink;
      })
      .then((link) => {
        if (Object.keys(state.feeds).includes(link)) {
          throw new Error(i18next.t('error.duplicate'));
        }

        return link;
      })
      .then((link) => {
        watchedState.form.state = 'sending';

        return makeRequest(link)
          .then((resp) => {
            watchedState.feeds = {
              ...watchedState.feeds,
              [link]: parseRss(resp.data),
            };

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
};

export default app;
