import { uniqueId } from 'lodash';

export default (response) => {
  const channelFeed = response.headers['x-final-url'];
  const rssData = response.data;
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssData, 'application/xml');
  const channelTitle = doc.querySelector('title').textContent;
  const channelDesc = doc.querySelector('description').textContent;

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesc = item.querySelector('description').textContent;
    const pubDateStr = item.querySelector('pubDate').textContent;
    const pubDate = new Date(pubDateStr).getTime();

    return {
      id: uniqueId('modal_'),
      itemTitle,
      itemLink,
      itemDesc,
      pubDate,
    };
  });

  const channel = {
    channelFeed,
    channelTitle,
    channelDesc,
    items,
  };

  return channel;
};
