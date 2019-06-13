import axios from 'axios';
import _ from 'lodash';
import { parseUpdate } from './parsers';
import state from './state';

const update = () => {
  const { channels } = state;

  const responsedChannelsItems = channels.map(({ channelFeed, channelId }) => (
    axios.get(channelFeed)
      .then(response => parseUpdate(response, channelId))));

  axios.all(responsedChannelsItems)
    .then((channelsItems) => {
      const newChannelsItems = channelsItems.map((channelItems, i) => {
        const newChannelItems = channelItems.filter(({ pubDate }) => (
          pubDate > channels[i].latestItemDate));
        if (newChannelItems.length > 0) {
          const newLatestItemDate = Math.max(...newChannelItems.map(({ pubDate }) => pubDate));
          state.channels[i].latestItemDate = newLatestItemDate;
        }
        return newChannelItems;
      });
      const itemsToUpdate = _.flatten(newChannelsItems);
      if (itemsToUpdate.length > 0) {
        state.toUpdate = itemsToUpdate;
      }
    })
    .catch((error) => {
      state.error = error;
      state.formState = 'error';
    })
    .finally(() => setTimeout(update, 5000));
};

export default update;
