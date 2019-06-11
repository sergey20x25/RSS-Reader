import { watch } from 'melanke-watchjs';
import axios from 'axios';
import $ from 'jquery';
import state from './state';
import validator from './validator';
import parseRss from './parser';
import { renderList, renderAlert, renderModal } from './renderers';

export default () => {
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

  // Работа с состоянием

  input.addEventListener('input', ({ target }) => {
    state.input = target.value;
    state.formState = validator(state);
  });

  input.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      button.click();
    }
  });

  button.addEventListener('click', () => {
    const feed = state.input;
    state.formState = 'loading';
    axios.get(`${cors}${feed}`)
      .then((response) => {
        if (response.headers['content-type'].includes('application/rss+xml')) {
          state.channels.push(parseRss(response));
          state.feeds.push(feed);
          state.formState = 'init';
        } else {
          state.formState = 'error';
        }
      })
      .catch((error) => {
        state.error = error;
        state.formState = 'error';
      });
  });

  // Работа с DOM

  watch(state, 'formState', () => {
    formStateMethods[state.formState]();
  });


  watch(state, 'channels', () => {
    renderList(state);
    renderModal(state);
  });

};
