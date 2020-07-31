'use strict';

// var postCounter = createCounter( 'Posts' ),
//     pageCounter = createCounter( 'Pages' );
//
// function createCounter( content ) {
//   var count = 0;
//   return function() {
//     count++;
//     console.log( `${content} count: ${count}` );
//   }
// }
//
// postCounter();
// postCounter();
// postCounter();
//
// pageCounter();
// pageCounter();
// pageCounter();


// var post = {
//       id: 1,
//       title: 'My Post'
//     },
//     link = document.querySelector( 'a.like' ),
//     likePost = likeCounter( post );
//
// link.addEventListener( 'click', handleLike );
//
// // Prevents link from being clicked
// function handleLike( event ) {
//
//   event.preventDefault();
//   likePost();
//
// }
//
// function likeCounter( post ) {
//
//   var likes = 0;
//
//   return function() {
//     likes++;
//     console.log( `${post.title} likes: ${likes}` );
//   }
//
// }
