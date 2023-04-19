import axios from 'axios';

const input = document.querySelector('.js-input');
const form = document.querySelector('.js-form');
const gallery = document.querySelector('.gallery');

// input.addEventListener('input', inputRequest);
form.addEventListener('submit', sendRequest);

// function inputRequest(e) {
//   return e.target.value;
// }

function sendRequest(e) {
  e.preventDefault();
  console.log(input.value);
  fetchRequest(input.value).then(images => generateMarkup(images.hits));
}

async function fetchRequest(request) {
  const response = await fetch(
    `https://pixabay.com/api/?key=35579706-8f6d810a90183242eb7243061&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
  );
  const images = response.json();
  return images;
}

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
        return `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags} data-largeimg="${largeImageURL}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>${likes}</b>
        </p>
        <p class="info-item">
          <b>${views}</b>
        </p>
        <p class="info-item">
          <b>${comments}</b>
        </p>
        <p class="info-item">
          <b>${downloads}</b>
        </p>
      </div>
    </div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}
