import isURL from 'validator/lib/isURL';

export default state => isURL(state.input)
  && !state.feeds.includes(state.input);
