# JavaScript Movie API Documentation

This documentation provides an overview of the JavaScript Movie API, which allows developers to interact with a movie database. The API provides methods to search for movies, retrieve movie details, and download movie files. The documentation includes code examples to help you understand how to use the API.

## Getting Started

To use the JavaScript Movie API, include the sdk(source) in your HTML document:

<script src="movie-api.js"></script>

## Movie Object

The "Movie" object represents the movie database and provides methods to search for movies and retrieve movie lists.

### Search for Movies

You can search for movies by name, director, or star cast. Use the following methods:

- "searchByName(query)": Search movies by name.
- "searchByDirector(query)": Search movies by director.
- "searchByStarcast(query)": Search movies by star cast.

Example:
```js
var movie = new Movie();
var searchList = movie.searchByName("Avengers");
searchList.then(function(List) {
  // Process the movie list
});
```

### Retrieve Movie List

You can retrieve a list of movies from the movie database. Use the "getList()" method.

Example:
```js
var movie = new Movie();
var moviesList = movie.getList();
moviesList.then(function(List) {
  // Process the movie list
});
```

## List Object
```js
.then(function(List) {
  // Process the movie list
});
```
The "List" object represents a list of movies and provides methods to retrieve movie details and navigate through the list.

### Retrieve Movie Details

You can retrieve details of individual movies from the movie list. Use the following methods:

- "get(index)": Retrieve details of a specific movie by its index in the list.
- "getAll()": Retrieve details of all movies in the list (array).

Example:
```js
var moviePromise = List.get(0);
moviePromise.then(function(movie) {
  // Process the movie details
});
```

```js
var allMoviesPromise = List.getAll();
allMoviesPromise.then(function(movies) {
  // Process all movie details
});
```

### Pagination

The movie list supports pagination. You can navigate to the first, last, next, or previous page using the following methods:

- "first()": Retrieve the first page of movies.
- "last()": Retrieve the last page of movies.
- "next()": Retrieve the next page of movies.
- "previous()": Retrieve the previous page of movies.

Example:
```js
var movie = new Movie();
var moviesList = movie.getList();

var nextPagePromise = moviesList.next();

var movie=nextPagePromise.get(0)
movie.then(function(movie) {
   // Process the movie details
});
```
### Get List Information

You can retrieve information about the movie list using the following methods:

- "current_pagination()": Retrieve the current page number in the pagination.
- "pagination_size()": Retrieve the total number of pages in the pagination.
- "length()": Retrieve the total number of movies in the list.

Example:
```js
var movie = new Movie();
var moviesList = movie.getList();

var currentPagePromise = moviesList.current_pagination();
currentPagePromise.then(function(currentPage) {
  // Process the current page number
});

var totalPagesPromise = moviesList.pagination_size();
totalPagesPromise.then(function(totalPages) {
  // Process the total number of pages
});

var totalMoviesPromise = moviesList.length();
totalMoviesPromise.then(function(totalMovies) {
  // Process the total number of movies
});
```