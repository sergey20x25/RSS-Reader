import isURL from 'validator/lib/isURL';

export default (state) => {
  if (isURL(state.input) && !state.feeds.includes(state.input)) {
    return 'valid';
  }
  return 'invalid';
};
