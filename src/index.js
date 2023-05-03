import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchRequest } from './js/fetchRequest';
import { bigImageModal } from './js/bigImageModal';
import { clearResults } from './js/clearResults';
import { generateMarkup } from './js/generateMarkup';

const input = document.querySelector('.js-input');
const form = document.querySelector('.js-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');

const NOTIFY_OPTIONS = {
  position: 'left-top',
  timeout: '2000',
  showOnlyTheLastOne: true,
};
const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
const observer = new IntersectionObserver(infinityScroll, OBSERVER_OPTIONS);
let lastPage = 0;
let request = '';
let pageNumber = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  sendRequest();
  observer.observe(guard);
});

/**
 *Іnfinite scroll
 */
function infinityScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && gallery.children.length > 0) {
      if (pageNumber === lastPage) {
        observer.unobserve(guard);
        Notify.info('End of content.', NOTIFY_OPTIONS);
        return;
      }
      sendRequest();
    }
  });
}
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
 *Show alerts on the screen, call markup generate function
 * @param {Array} images
 * @returns
 */
function checkResult(images) {
  lastPage = Math.ceil(images.totalHits / 40);

  if (images.hits.length === 0 && pageNumber === 1) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      NOTIFY_OPTIONS
    );
    return;
  }

  Notify.success(
    `Hooray! We found ${images.totalHits} images.`,
    NOTIFY_OPTIONS
  );

  generateMarkup(images.hits, gallery);
  bigImageModal.refresh();
}
