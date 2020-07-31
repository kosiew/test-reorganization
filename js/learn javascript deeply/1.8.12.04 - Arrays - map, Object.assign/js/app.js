'use strict';

const postIds = [ 1, 2, 3 ],
  posts = [
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
      title: 'Hello Maps',
      cat: [ 'js', 'arrays' ],
    },
    {
      id: 5,
      title: 'Hello Long Title for Use with Maps',
      cat: [ 'js', 'arrays' ],
    },
    {
      id: 6,
      title: 'Another Example of a Long Title for Use with Maps',
      cat: [ 'js', 'arrays' ],
    },
  ];

// Map all ids through a function adding 1 to each id
const newIds = postIds.map( function( id ) {
  return id + 1;
} );
console.group( 'Add +1 to IDs' );
console.log( 'postIds', postIds);
console.log( 'newIds', newIds );
console.groupEnd();


// Arrow function example doubling IDs
const doubleIds = postIds.map( id => id * 2 );
console.group( 'Double each ID' );
console.log( 'postIds', postIds );
console.log( 'doubleIds', doubleIds );
console.groupEnd();


// // Mapping creates a reference, not new object
// const drafts = posts.map( post => {
//   post.title = `DRAFT: ${post.title}`;
//   return post;
// } );
// console.group( 'Add DRAFT: to post (Obj Reference)' );
// console.log( 'drafts', drafts );
// console.log( 'posts', posts );
// console.log( 'posts === drafts', posts === drafts );
// console.groupEnd();


// Map posts and create new objects
const expired = posts.map( post => {
  const p = Object.assign( {}, post );
  p.title = `EXPIRED: ${p.title}`;
  return p;
});
console.group( 'Add EXPIRED: to post (Obj.assign)' );
console.log( 'expired', expired );
console.log( 'posts', posts );
console.groupEnd();


// Filter before mapping
const arrayPosts = posts
  .filter( post => post.cat.includes( 'arrays' ) )
  .map( post => {
    const p = Object.assign( {}, post );
    return p;
  });
console.group( 'Filter for "Arrays" before mapping and change first title name' );
arrayPosts[0].title = 'NEW TITLE: Hello Arrays!';
console.log( 'arrayPosts', arrayPosts );
console.log( 'posts', posts );
console.groupEnd();

const firstPosts = posts.filter( post => post.id <= 3 );
console.log( 'firstPosts', firstPosts );


// Map posts to add to page
posts.map( post => renderPost( post ) );


// Function for rendering post titles to page
function renderPost( post ) {

  const container = document.getElementById( 'pageContent' );
  const postTitle = document.createTextNode( post.title );
  const h2 = document.createElement( 'h2' );

  h2.appendChild( postTitle );
  container.appendChild( h2 );

}
