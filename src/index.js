import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import {PixabayApi} from './pixabay-api';

const pixabayApi = new PixabayApi();

const searchFormEl = document.querySelector('#search-form');
// const searchFormBtn = document.querySelector('[submit]');
const loadMoreBtn = document.querySelector('.load-more');
const galleryList = document.querySelector('.gallery');

const onSearchFormSubmit = e => {
e.preventDefault();
pixabayApi.page = 1;
pixabayApi.searchQuaryEl = e.currentTarget.searchQuery.value;
pixabayApi
.fetchPhotosByQuary()
.then(data => {
//   galleryList.innerHTML = markup;
galleryList(createGalleryMarkup(data));
loadMoreBtn.classList.remove('.is-hidden');
loadMoreBtn.addEventListener('click', onMoreBtnClick);
})
.catch(err => {
    // Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    console.log(err);
});

};

const onMoreBtnClick = e => {
    pixabayApi.page += 1; 
    pixabayApi
.fetchPhotosByQuary()
.then(data => {
//   galleryList.innerHTML = markup;
galleryList.insertAdjacentHTML('beforeend', createGalleryMarkup(data));
if(pixabayApi.page === Math.ceil(data.total / pixabayApi.perPage)) {
    loadMoreBtn.classList.add('.is-hidden');
    loadMoreBtn.removeEventListener('click', onMoreBtnClick);
}
})
.catch(err => {
    // Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    console.log(err);
});
};
    

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
  galleryList.insertAdjacentHTML('beforeend', markup); 
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);
