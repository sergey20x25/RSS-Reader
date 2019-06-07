import { uniqueId } from 'lodash';

export default (rssData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssData, 'application/xml');
  const channelTitle = doc.querySelector('title').textContent;
  const channelDesc = doc.querySelector('description').textContent;

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesc = item.querySelector('description').textContent;
    return {
      id: uniqueId('modal_'),
      itemTitle,
      itemLink,
      itemDesc,
    };
  });

  const channel = {
    channelTitle,
    channelDesc,
    items,
  };

  return channel;
};
