'use strict';

const posts = [
    {
      id: 1,
      title: 'Hello World',
      cat: [ 'js', '101' ],
    },
    {
      id: 2,
      title: 'Hello JavaScript',
      cat: [ 'js' ],
    },
    {
      id: 3,
      title: 'Hello Arrays',
      cat: [ 'js', 'arrays' ],
    },
    {
      id: 4,
      title: 'Hello Filters',
      cat: [ 'js', 'arrays' ],
    },
    {
      id: 5,
      title: 'Hello Long Title for Use with Filters',
      cat: [ 'js', 'arrays' ],
    },
    {
      id: 6,
      title: 'Another Example of a Long Title for Use with Filters',
      cat: [ 'js', 'arrays' ],
    },
  ];

// Filter creates a new array but only reference to the objects
const jsPosts = posts.filter( post => post.title.includes( 'JavaScript' ) );
console.log( 'jsPosts.length', jsPosts.length );
console.log( 'jsPosts', jsPosts );
console.log( 'jsPosts === posts', jsPosts === posts );
jsPosts[0].title = 'JS Only';
console.log( 'posts', posts );

// Filtering based on category in cat array
const arrayCatPosts = posts.filter( post  => post.cat.includes('arrays') );
console.log( 'arrayCatPosts', arrayCatPosts );


// Filtering based on title length
const postsWithLongTitles = posts.filter( post  => {
  if( 20 <= post.title.length ) {
      post.title = post.title.slice( 0, 17 ).trim() + '..';
      return post;
  }
} );
console.log( 'postsWithLongTitles', postsWithLongTitles );
console.log( 'posts', posts );
