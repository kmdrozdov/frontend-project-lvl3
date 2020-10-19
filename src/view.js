const renderFormFeedback = (state) => {
  const formFeedback = document.querySelector('div.form-feedback');
  formFeedback.classList.remove('text-danger', 'text-success');
  formFeedback.innerText = '';

  if (state.form.state === 'invalid') {
    formFeedback.classList.add('text-danger');
    formFeedback.innerText = state.form.error;
  } else if (state.form.state === 'done') {
    formFeedback.classList.add('text-success');
    formFeedback.innerText = 'RSS has been loaded';
  }
};

const renderFormState = (state) => {
  const rssLinkInput = document.querySelector('input[name="rssLink"]');
  const submitButton = document.querySelector('button[type="submit"]');
  const toDisable = state.form.state === 'sending';

  rssLinkInput.disabled = toDisable;
  submitButton.disabled = toDisable;

  if (state.form.state === 'invalid') {
    rssLinkInput.classList.add('is-invalid');
  } else {
    rssLinkInput.classList.remove('is-invalid');
  }

  rssLinkInput.value = state.form.data.rssLink;
  renderFormFeedback(state);
};

const renderFeedInfo = (state) => {
  const { feeds } = state;
  const feedsContainer = document.querySelector('div.feeds');

  const feedsHTML = feeds.map(({ channelTitle, items }) => {
    const itemsHTML = items.map(({ link, title }) => (`
      <div>
        <a href="${link}">${title}</a>
      </div>
    `));

    return `
      <h2>${channelTitle}</h2>
      ${itemsHTML.join('')}
    `;
  });

  feedsContainer.innerHTML = `
    <div class="row">
      <div class="col-md-10 col-lg-8 mx-auto feeds">
        ${feedsHTML.join('')}
      </div>
    </div>
  `;
};

export {
  renderFeedInfo,
  renderFormState,
};
