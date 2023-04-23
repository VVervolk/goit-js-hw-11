/**
 * Generate markup of cards from 'image' to 'element'
 * @param {Array} image
 * @param {DOM-element} element
 */
export function generateMarkup(image, element) {
  const markup = image
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
                <div class="photo-card">
                  <a href="${largeImageURL}">  
                    <img class="photo-card__img gallery__image" src="${webformatURL}" alt="${tags} loading="lazy" />
                  </a>
                  <div class="info">
                    <p class="info-item">
                      <b>Likes</b>
                      ${likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b>
                      ${views}
                    </p>
                    <p class="info-item">
                      <b>Comments</b>
                      ${comments}
                    </p>
                    <p class="info-item">
                      <b>Downloads</b>
                      ${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join('');

  element.insertAdjacentHTML('beforeend', markup);
}
