import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';
import { fetchRequest } from './js/fetchRequest';
import { bigImageModal } from './js/bigImageModal';

import { clearResults } from './js/clearResults';
import { generateMarkup } from './js/generateMarkup';

const input = document.querySelector('.js-input');
const form = document.querySelector('.js-form');
const gallery = document.querySelector('.gallery');

const NOTYFY_OPTIONS = {
  position: 'left-top',
  timeout: '2000',
  showOnlyTheLastOne: true,
};
let lastPage = 0;
let request = '';
let pageNumber = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  sendRequest();
});

/**
 *Іnfinite scroll
 */
window.addEventListener(
  'scroll',
  throttle(function () {
    if (
      window.scrollY + window.innerHeight + 1000 >=
      document.documentElement.scrollHeight
    ) {
      sendRequest();
    }
  }, 1000)
);

/**
 * Check value of input, update pageNumber , send request to api
 *
 */
function sendRequest() {
  if (request !== input.value) {
    clearResults(gallery);
    pageNumber = 0;
  }

  pageNumber += 1;

  request = input.value;

  fetchRequest(request, pageNumber)
    .then(images => checkResult(images))
    .catch(console.log);
}

/**
 *Control buttonLoadMore, show alerts on the screen, call markup generate function, call smooth page scrolling function
 * @param {Array} images
 * @returns
 */
function checkResult(images) {
  lastPage = Math.ceil(images.totalHits / 40);

  if (images.hits.length === 0 && pageNumber === 1) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      NOTYFY_OPTIONS
    );
    return;
  } else if (images.hits.length === 0 && pageNumber > lastPage) {
    Notify.info('End of content.', NOTYFY_OPTIONS);
    return;
  }

  Notify.success(
    `Hooray! We found ${images.totalHits} images.`,
    NOTYFY_OPTIONS
  );

  generateMarkup(images.hits, gallery);
  bigImageModal.refresh();
}
