// 'use strict';

var posts = [
      { id: 1, title: 'Hello World' },
      { id: 2, title: 'Hello JS' },
      { id: 3, title: 'Hello Generator' }
    ],
    listPosts;

function* getPosts() {

  for (let post of posts) {
    yield post;
  }

}

// listPosts = getPosts();
//
// console.log(listPosts.next());
// console.log(listPosts.next());
// console.log(listPosts.next());
// console.log(listPosts.next());

// function renderBlock( msg ) {
//   return msg;
// }
//
// function* renderUI() {
//   yield renderBlock( 'Header' );
//   yield* getPosts();
//   yield renderBlock( 'Footer' );
// }
//
// var UI = renderUI();
//
// console.log(UI.next().value);
// console.log(UI.next().value.title);
// console.log(UI.next().value.title);
// console.log(UI.next().value.title);
// console.log(UI.next().value);
