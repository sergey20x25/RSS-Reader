import { watch } from 'melanke-watchjs';
import axios from 'axios';
import state from './state';
import isValid from './validator';
import parseRss from './parser';
import render from './render';

export default () => {
  const input = document.getElementById('feed-input');
  const button = document.getElementById('button-addon2');
  const cors = 'https://cors-anywhere.herokuapp.com/';

  // Работа с состоянием

  input.addEventListener('input', ({ target }) => {
    state.input = target.value;
    state.valid = isValid(state);
  });

  input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
    }
  });

  button.addEventListener('click', () => {
    const feed = state.input;
    axios.get(`${cors}${feed}`)
      .then(({ data }) => {
        state.channels.push(parseRss(data));
        state.feeds.push(feed);
        state.input = '';
      })
      .catch((error) => {
        state.error = error;
      });
  });

  // Работа с DOM

  watch(state, 'valid', () => {
    if (state.valid === true) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
    button.removeAttribute('disabled');
    if (!state.valid) {
      button.setAttribute('disabled', 'disabled');
    }
  });

  watch(state, 'feeds', () => {
    input.value = '';
    button.setAttribute('disabled', 'disabled');
  });

  watch(state, 'error', () => {
    console.log(state.error);
  });

  watch(state, 'channels', () => {
    render(state);
  });
};
