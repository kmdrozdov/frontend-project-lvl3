import axios from 'axios';
import onChange from 'on-change';
import { string } from 'yup';

import parseRss from './parseRss';
import { renderFeedInfo, renderFormState } from './view';

const validator = string().url();

const app = () => {
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

    validator.isValid(rssLink)
      .then((res) => {
        if (!res) {
          throw new Error('Invalid URL');
        }

        return rssLink;
      })
      .then((link) => {
        if (state.feeds.some(({ feedLink }) => feedLink === link)) {
          throw new Error('Feed URL has been already loaded');
        }

        return link;
      })
      .then((link) => {
        watchedState.form.state = 'sending';

        return axios.get(`https://cors-anywhere.herokuapp.com/${link}`, {
          headers: {
            'X-Requested-With': null,
          },
        })
          .then((resp) => {
            watchedState.feeds = [
              ...watchedState.feeds,
              {
                feedLink: link,
                ...parseRss(resp.data),
              },
            ];

            watchedState.form = {
              ...watchedState.form,
              data: {
                rssLink: '',
              },
              error: '',
              state: 'done',
            };
          })
          .catch(() => {
            throw new Error('Network error');
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
