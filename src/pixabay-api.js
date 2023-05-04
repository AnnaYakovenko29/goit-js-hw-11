'use-strict';
import axios from 'axios';

export class PixabayApi {
    #BASE_URL = 'https://pixabay.com/api';
    #API_KEY = '36006142-181823dd87fc38ea464bb0f7d';
    constructor() {
        this.page = null;
        this.searchQuaryEl = '';
        this.perPage = 40;
    }

    fetchPhotosByQuary() {
        const searchParams = new URLSearchParams({
            q: this.searchQuaryEl,
            page: this.page,
            per_page: this.perPage,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch:true,
            key: this.#API_KEY,
        })
        return fetch(`${this.#BASE_URL}/?${searchParams}`).then(response => {
            if(!response.ok) {
                throw new Error(response.status)
            }
            return response.json()
        });
    }
}