/* eslint no-param-reassign: ["error", { "props": false }] */

import { watch } from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
import { flatten } from 'lodash';
import isValid from './validator';
import parseChannel from './parser';
import {
  renderList, renderAlert, renderModal, renderUpdate,
} from './renderers';

export default () => {
  const state = {
    formState: '',
    input: '',
    feeds: [],
    error: '',
    channels: [],
    toUpdate: [],
  };

  const input = document.getElementById('feed-input');
  const button = document.getElementById('button-addon2');
  const loading = document.getElementById('loading-icon');
  const alert = document.getElementById('alert');
  const cors = 'https://cors-anywhere.herokuapp.com/';

  const formStateMethods = {
    valid() {
      input.classList.remove('is-invalid');
      button.removeAttribute('disabled');
    },
    invalid() {
      input.classList.add('is-invalid');
      button.setAttribute('disabled', 'disabled');
    },
    loading() {
      button.setAttribute('disabled', 'disabled');
      loading.classList.remove('invisible');
    },
    init() {
      loading.classList.add('invisible');
      input.value = '';
      button.setAttribute('disabled', 'disabled');
    },
    error() {
      loading.classList.add('invisible');
      console.log(state.error);
      alert.innerHTML = renderAlert('Error!');
      setTimeout(() => {
        $('.alert').alert('close');
      }, 7000);
    },
  };

  input.addEventListener('input', ({ target }) => {
    state.input = target.value;
    state.formState = isValid(state) ? 'valid' : 'invalid';
  });

  button.addEventListener('click', () => {
    const feed = state.input;
    state.formState = 'loading';
    axios.get(`${cors}${feed}`)
      .then((response) => {
        const parsedCannel = parseChannel(response);
        state.channels.push(parsedCannel);
        state.feeds.push(feed);
        state.formState = 'init';
      })
      .catch((error) => {
        state.error = error;
        state.formState = 'error';
      });
  });

  input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      button.click();
    }
  });

  const updateChannels = () => {
    const { channels } = state;
    const requests = channels.map(({ channelFeed }) => axios.get(channelFeed));
    axios.all(requests)
      .then((responses) => {
        const newChannels = responses.map(response => parseChannel(response));
        const newItems = newChannels.map((newChannel, i) => {
          const channel = state.channels[i];
          if (newChannel.latestItemDate > channel.latestItemDate) {
            const newChannelItems = newChannel.items.filter(({ pubDate }) => (
              pubDate > channel.latestItemDate));
            newChannelItems.forEach((item) => {
              item.channelId = channel.channelId;
            });
            state.channels[i].latestItemDate = newChannel.latestItemDate;
            return newChannelItems;
          }
          return [];
        });
        const itemsToUpdate = flatten(newItems);
        if (itemsToUpdate.length > 0) {
          state.toUpdate = itemsToUpdate;
        }
      })
      .catch((error) => {
        state.error = error;
        state.formState = 'error';
      })
      .finally(() => setTimeout(updateChannels, 5000));
  };

  watch(state, 'formState', () => {
    formStateMethods[state.formState]();
  });

  watch(state, 'feeds', () => {
    renderList(state);
    renderModal(state);
  });

  watch(state, 'toUpdate', () => {
    renderUpdate(state);
  });

  updateChannels(state);
};
