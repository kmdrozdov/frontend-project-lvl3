export default (rssData) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(rssData, 'application/xml');

  const channelData = rss.querySelector('channel');
  const channelTitle = channelData.querySelector('title').textContent;
  const channelItems = [...channelData.querySelectorAll('item')];

  const items = channelItems.map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;

    return {
      link,
      title,
    };
  });

  return {
    channelTitle,
    items,
  };
};
