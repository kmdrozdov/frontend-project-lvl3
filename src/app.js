import onChange from 'on-change';
import { string } from 'yup';

const validator = string().url();

const renderFormMessage = (state) => {
  const formMessage = document.querySelector('div.form-message');
  const form = document.querySelector('form');

  if (formMessage !== null) {
    formMessage.remove();
  }

  if (state.form.state === 'invalid') {
    if (formMessage !== null) {
      formMessage.innerText = state.form.error;
      return;
    }

    const message = document.createElement('div');
    message.classList.add('form-message', 'text-danger');
    message.innerText = state.form.error;

    form.parentNode.append(message);
  }
};

const renderInputValidationState = (state) => {
  const rssLinkInput = document.querySelector('input[name="rssLink"]');

  if (state.form.state === 'invalid') {
    rssLinkInput.classList.add('is-invalid');
  } else {
    rssLinkInput.classList.remove('is-invalid');
  }

  renderFormMessage(state);
};

const app = () => {
  const state = {
    form: {
      data: {
        rssLink: '',
      },
      state: 'empty',
      error: '',
    },
  };

  const watchedState = onChange(state, (path) => {
    if (path.startsWith('form')) {
      renderInputValidationState(state);
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
        if (res) {
          watchedState.form.state = 'valid';
          return;
        }

        watchedState.form = {
          ...watchedState.form,
          state: 'invalid',
          error: 'Invalid URL value',
        };
      });
  });
};

export default app;
