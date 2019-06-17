import { uniqueId, maxBy } from 'lodash';

export default (data) => {
  const channelFeed = data.config.url;
  const rssData = data.data;
  const parser = new DOMParser();
  const doc = parser.parseFromString(rssData, 'application/xml');
  const channelTitle = doc.querySelector('title').textContent;
  const channelDesc = doc.querySelector('description').textContent;
  const channelId = uniqueId('channel_');

  const items = [...doc.querySelectorAll('item')].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemLink = item.querySelector('link').textContent;
    const itemDesc = item.querySelector('description').textContent;
    const pubDateStr = item.querySelector('pubDate').textContent;
    const pubDate = new Date(pubDateStr).getTime();
    const id = uniqueId('item_');
    return {
      id,
      itemTitle,
      itemLink,
      itemDesc,
      pubDate,
    };
  });

  const latestItemDate = maxBy(items, 'pubDate').pubDate;

  const channel = {
    channelId,
    channelFeed,
    channelTitle,
    channelDesc,
    latestItemDate,
    items,
  };
  return channel;
};
