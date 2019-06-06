export default ({ channels }) => {
  const feedsElement = document.getElementById('feeds');
  const html = channels.map(({ channelTitle, channelDesc, items }) => `
    <h2>${channelTitle}</h2>
    <p>${channelDesc}</p>
    <ul>
      ${items.map(({ itemTitle, itemLink }) => `<p><a href="${itemLink}">${itemTitle}</a></p>`).join('')}
    </ul>`).join('');
  feedsElement.innerHTML = html;
};
