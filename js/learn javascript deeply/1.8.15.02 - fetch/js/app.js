"use strict";

const restRoot = "https://javascriptforwp.com/wp-json";
const postId = 26612;

let url = `${restRoot}/wp/v2/posts/${postId}`;

fetch(url)
  .then(response => {
    return response.json();
  })
  .then(post => {
    return displayPost(post);
  })
  .catch(error => {
    console.log(error);
  });

function displayPost(post) {
  console.log(post.title.rendered);
}
