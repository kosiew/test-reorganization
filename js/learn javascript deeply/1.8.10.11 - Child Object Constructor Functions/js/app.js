'use strict';

var latestId = 0,
    draft,
    post;


function Content( obj ) {

  this.id = obj.id || null;
  this.title = obj.title || null;
  this.slug = obj.slug || null;

  this.render = function render() {
    console.log( this );
  }

}

function Post( obj ) {

  Content.call( this, obj );
  this.status = obj.status || 'publised';
  this.categories = obj.categories || [];

}

function Draft( obj ) {

  obj.title = `DRAFT: ${obj.title}`;
  Post.call( this, obj );
  this.status = 'draft';

}

draft = new Draft({
  id: getNewId(),
  title: 'New Post!',
  categories: [ 1 ]
});

post = new Post( {
  id: getNewId(),
  title: 'New Post!',
  categories: [ 1, 2, 3 ]
});


draft.render();
post.render();

console.log(
  'Post.isPrototypeOf( post ):',
  Post.isPrototypeOf( post )
);
console.log(
  'post.constructor === Post:',
  post.constructor === Post
);
console.log(
  'post.constructor.name:',
  post.constructor.name
);
console.log(
  'post instanceof Post:',
  post instanceof Post
);


function getNewId() {
  return ++latestId;
}
