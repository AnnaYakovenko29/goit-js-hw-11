import './sass/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {PixabayApi} from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const pixabayApi = new PixabayApi();
const lightbox = new SimpleLightbox('.gallery a');
console.log(lightbox);

const searchFormEl = document.querySelector('#search-form');
// const searchFormBtn = document.querySelector('[submit]');
const loadMoreBtn = document.querySelector('.load-more');
const galleryList = document.querySelector('.gallery');

const onSearchFormSubmit = async e =>{
e.preventDefault();
pixabayApi.page = 1;
pixabayApi.searchQuaryEl = e.currentTarget.searchQuery.value.trim();
try {
  const responce = await pixabayApi.fetchPhotosByQuary()
  const {data} = responce;
  console.log(responce);
  galleryList.innerHTML = createGalleryMarkup(data);
  lightbox.refresh();

if(pixabayApi.perPage < data.total) {
  loadMoreBtn.classList.remove('is-hidden');
  loadMoreBtn.addEventListener('click', onMoreBtnClick);
} else if (data.total === 0) {
  galleryList.innerHTML = '';
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
} else if(data.total > 0) {
  Notify.success(`Hooray! We found ${data.total} images.`);
}
} catch (error) {
  console.log(error.message);
}
};

// .then(responce => {
// const {data} = responce;
// console.log(data);
// galleryList.innerHTML = createGalleryMarkup(data);
// lightbox.refresh();

// if(pixabayApi.perPage < data.total) {
//   loadMoreBtn.classList.remove('is-hidden');
//   loadMoreBtn.addEventListener('click', onMoreBtnClick);
// } else if (data.total === 0) {
//   galleryList.innerHTML = '';
//   Notify.failure('Sorry, there are no images matching your search query. Please try again.');
// } else if(data.total > 0) {
//   Notify.success(`Hooray! We found ${data.total} images.`);
// }
// })
// .catch(err => {
//     console.log(err);
// });



const onMoreBtnClick = async e => {
    pixabayApi.page += 1; 
try {
  const responce = await pixabayApi.fetchPhotosByQuary()
  const {data} = responce;
  galleryList.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
  lightbox.refresh();
  
  console.log(pixabayApi.perPage, data.hits.length);
  if(pixabayApi.page === Math.ceil(data.total / pixabayApi.perPage)) {
      loadMoreBtn.classList.add('is-hidden');
      loadMoreBtn.removeEventListener('click', onMoreBtnClick);
      Notify.info("We're sorry, but you've reached the end of search results.")
  }
} catch (error) {
  console.log(error.message);
}
}; 
// .then(responce => {
// const {data} = responce;
// galleryList.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
// lightbox.refresh();

// console.log(pixabayApi.perPage, data.hits.length);
// if(pixabayApi.page === Math.ceil(data.total / pixabayApi.perPage)) {
//     loadMoreBtn.classList.add('is-hidden');
//     loadMoreBtn.removeEventListener('click', onMoreBtnClick);
//     Notify.info("We're sorry, but you've reached the end of search results.")
// }
// }) 
// .catch(err => {
//     console.log(err);
// });
  

function createGalleryMarkup(images) {
    const markup = images.hits
    .map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
      return (`
      <div class="photo-card list">
      <a href="${webformatURL}">
      <img
        class="photo-card__img"
        src="${largeImageURL}" 
        alt="${tags}" 
        loading="lazy" 
        width=""
        height=""
      />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span>${downloads}</span>
      </p>
    </div>
    </div>
      `)
  })
  .join(''); 
  return markup;
  // galleryList.insertAdjacentHTML('beforeend', markup); 
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
