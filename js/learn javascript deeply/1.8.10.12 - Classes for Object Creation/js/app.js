'use strict';

var latestId = 0;

class Content {

  constructor( obj ) {
    this.id = obj.id || null;
    this.title = obj.title || null;
  }

  render() {
    console.log( this );
  }

}

class Post extends Content {

  constructor( obj ) {
    super( obj );
    this.slug = obj.slug;
    this.status = 'published';
    this.categories = obj.categories || [ 'undefined' ];
  }

}

class Draft extends Post {

    constructor( obj ) {
      super( obj );
      this.status = 'draft';
    }

  }

var draft = new Draft({
  id: getNewId(),
  title: 'New Draft Post'
});

var post = new Post({
  id: getNewId(),
  title: 'New Post',
  categories: [ 1, 2 ]
});

draft.render();
post.render();

// for( let obj of [ Content, Post, post, Draft, draft ] ) {
//   console.log( obj.name || obj.title, typeof obj );
// }


console.log( 'Is Post prototype for post?', Post.isPrototypeOf( post ) );
console.log( 'Is post an instance of Post?', post instanceof Post );

console.log('Is Object prototype for Post?', Object.isPrototypeOf(Post));
console.log( 'Is Post an instance of Object?', Post instanceof Object);
console.log( 'Is Post an instance of Function?', Post instanceof Function );
console.log( 'Is Function an instance of Object?', Function instanceof Object );
console.log( 'Is Object a prototype for Function?', Object.isPrototypeOf( Function ) );


function getNewId() {
  return ++latestId;
}
