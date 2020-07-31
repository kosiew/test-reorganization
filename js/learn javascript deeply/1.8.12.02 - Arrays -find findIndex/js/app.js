'use strict';

const postIds = [1, 2, 3, 4, 5],
  posts = [
    {
      id: 1,
      title: 'Hello World'
    },
    {
      id: 2,
      title: 'Hello JavaScript'
    },
    {
      id: 3,
      title: 'Hello Arrays'
    }
  ];

function greaterThan( id ) {
  return id > 3;
}

console.group( '.find()' );

// .find() calling greaterThan function
console.log( postIds.find( greaterThan ) );

// .find() with anonymous function
console.log( postIds.find( id => id >= 2 ) );

// .find() looking for object based on property
const { title } = posts.find( post => 2 === post.id );
console.log( title );

console.groupEnd();
console.group( '.findIndex()' );

// .findIndex() calling greaterThan function
console.log( 'Greater than 3 [Index]:', postIds.findIndex( greaterThan ) );

// .findIndex() looking for object based on property
const i = posts.findIndex( post => 2 === post.id );
console.log( 'Post ID 2 [Index]: ', i, posts[ i ] );

console.groupEnd();
