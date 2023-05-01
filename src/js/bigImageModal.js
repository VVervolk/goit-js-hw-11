import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
export let bigImageModal = new SimpleLightbox('.gallery a', {
  showCounter: false,
  loop: false,
  nav: false,
});
