export const renderList = ({ channels }) => {
  const feedsElement = document.getElementById('feeds');
  const html = channels.map(({ channelTitle, channelDesc, items }) => `
    <h2>${channelTitle}</h2>
    <p>${channelDesc}</p>
    <ul>
      ${items.map(({ itemTitle, itemLink }) => `<p><a href="${itemLink}">${itemTitle}</a></p>`).join('')}
    </ul>`).join('');
  feedsElement.innerHTML = html;
};

export const renderAlert = message => `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
