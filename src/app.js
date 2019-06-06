import { watch } from 'melanke-watchjs';
import axios from 'axios';
import state from './state';
import isValid from './validator';

export default () => {
  const input = document.getElementById('feed-input');
  const button = document.getElementById('button-addon2');

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
    state.feeds.push(state.input);
    state.input = '';
    input.value = '';
    input.classList.remove('is-valid');
    button.setAttribute('disabled', 'disabled');
    console.log(state);
  });

  watch(state, 'valid', () => {
    input.classList.remove('is-valid', 'is-invalid');
    const validClass = state.valid ? 'is-valid' : 'is-invalid';
    input.classList.add(validClass);
    button.removeAttribute('disabled');
    if (!state.valid) {
      button.setAttribute('disabled', 'disabled');
    }
  });
};
