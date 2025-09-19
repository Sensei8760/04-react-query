import { api } from './api';
import type { MoviesResponse } from '../types/movie';


interface FetchMoviesParams {
query: string;
page?: number;
}


export async function fetchMovies({ query, page = 1 }: FetchMoviesParams) {
const { data } = await api.get<MoviesResponse>('/search/movie', {
params: {
query,
page,
include_adult: false,
language: 'en-US',
},
});
return data;
}