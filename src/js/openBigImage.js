import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
/**
 * Open modal with big image
 * @param {'click'} evt
 * @returns modal
 */
export function openBigImage(evt) {
  evt.preventDefault();
  if (!evt.target.classList.contains('gallery__image')) {
    return;
  }

  bigImageModal.on('show.simplelightbox');
}
