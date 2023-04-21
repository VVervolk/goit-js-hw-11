import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const input = document.querySelector('.js-input');
const form = document.querySelector('.js-form');
const gallery = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');

const NOTYFY_OPTIONS = {
  position: 'left-top',
  timeout: '2000',
  showOnlyTheLastOne: true,
};
let lastPage = 0;
let request = '';
let pageNumber = 0;
let bigImageModal = new SimpleLightbox('.gallery a', {
  showCounter: false,
  loop: false,
  nav: false,
});

form.addEventListener('submit', e => {
  e.preventDefault();
  sendRequest();
});
buttonLoadMore.addEventListener('click', sendRequest);
gallery.addEventListener('click', openBigImage);

/**
 *Іnfinite scroll
 */
window.addEventListener(
  'scroll',
  throttle(function () {
    if (
      window.scrollY + window.innerHeight + 400 >=
      document.documentElement.scrollHeight
    ) {
      console.log('hi');
      sendRequest();
    }
  }, 1000)
);

/**
 * Open modal with big image
 * @param {'click'} evt
 * @returns modal
 */
function openBigImage(evt) {
  evt.preventDefault();
  if (!evt.target.classList.contains('gallery__image')) {
    return;
  }

  bigImageModal.on('show.simplelightbox');
}

/**
 * Check value of input, update pageNumber , send request to api
 * @param {event} e
 */
function sendRequest(e) {
  if (request !== input.value) {
    clearResults();
    pageNumber = 0;
  }

  pageNumber += 1;

  request = input.value;

  fetchRequest(request)
    .then(images => checkResult(images))
    .catch(console.log);
}

async function fetchRequest(request) {
  const params = {
    key: '35579706-8f6d810a90183242eb7243061',
    q: `${request}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: `${pageNumber}`,
    per_page: 40,
  };
  const response = await axios.get(`https://pixabay.com/api/`, { params });
  const images = await response.data;

  return images;
}

/**
 *
 * @param {Array} images
 * @returns
 */
function checkResult(images) {
  lastPage = Math.ceil(images.totalHits / 40);
  console.log(lastPage);

  if (pageNumber === lastPage) {
    buttonLoadMore.classList.add('hidden');
  }

  if (images.hits.length === 0 && pageNumber > lastPage) {
    Notify.info('End of content.', NOTYFY_OPTIONS);

    return;
  }

  if (images.hits.length === 0 && pageNumber === 1) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      NOTYFY_OPTIONS
    );

    return;
  }

  Notify.success(
    `Hooray! We found ${images.totalHits} images.`,
    NOTYFY_OPTIONS
  );

  generateMarkup(images.hits);

  if (pageNumber > 1) {
    buttonLoadMore.classList.add('hidden');
    buttonLoadMore.classList.remove('hidden');

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  bigImageModal.refresh();

  if (pageNumber === 1) {
    buttonLoadMore.classList.remove('hidden');
  }
}

/**
 * Generate markup of cards
 * @param {Array} image
 */
function generateMarkup(image) {
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

  gallery.insertAdjacentHTML('beforeend', markup);
}

/**
 * Remove previous results
 */
function clearResults() {
  gallery.innerHTML = '';
}
