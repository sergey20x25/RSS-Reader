export const renderList = ({ channels }) => {
  const feedsElement = document.getElementById('feeds');
  const listHtml = channels.map(({ channelTitle, channelDesc, items }) => `
    <h2>${channelTitle}</h2>
    <p>${channelDesc}</p>
    <ul class="list-group list-group">
      ${items.map(({ itemTitle, itemLink, id }) => `<li class="list-group-item">
        <a href="${itemLink}">${itemTitle}</a>
        <button type="button" class="btn btn-outline-secondary btn-sm float-right" data-toggle="modal" data-target="#${id}">
          Preview
        </button>
      </li>`).join('')}
    </ul>`).join('');
  feedsElement.innerHTML = listHtml;
};

export const renderModal = ({ channels }) => {
  const modalElement = document.getElementById('modalContainer');
  const modalHtml = channels.map(({ items }) => items.map(({ itemTitle, itemDesc, id }) => `
    <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${itemTitle}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${itemDesc}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`).join('')).join('');
  modalElement.innerHTML = modalHtml;
};

export const renderAlert = message => `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`;
