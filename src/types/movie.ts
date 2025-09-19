export interface Movie {
id: number;
title: string;
overview: string;
release_date: string;
vote_average: number;
poster_path: string | null;
backdrop_path: string | null;
}


export interface MoviesResponse {
page: number;
total_pages: number; 
total_results: number; 
results: Movie[];
}