/**
 *Smooth page scrolling
 * @param {DOM-element} element
 */
export function smoothPageScrolling(element) {
  const { height: cardHeight } =
    element.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
