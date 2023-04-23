import axios from 'axios';

export async function fetchRequest(request, page) {
  const params = {
    key: '35579706-8f6d810a90183242eb7243061',
    q: `${request}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: `${page}`,
    per_page: 40,
  };
  const response = await axios.get(`https://pixabay.com/api/`, { params });
  const images = await response.data;

  return images;
}
