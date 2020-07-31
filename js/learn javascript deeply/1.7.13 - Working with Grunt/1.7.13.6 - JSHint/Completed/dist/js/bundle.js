
/**
 * Main JSON object of posts, pages and settings
 */
var posts =
    [
      {
        "id":1,
        "date":"2016-01-09T22:05:09",
        "modified":"2016-01-09T22:05:09",
        "slug":"hello-world",
        "type":"post",
        "title":"Hello world!",
        "content":"Welcome to WordPress. This is your first post. Edit or delete it, then start writing!"
      },
      {
        "id":2,
        "date":"2016-01-10T22:05:09",
        "modified":"2016-01-10T22:05:09",
        "slug":"learning-javascript",
        "type":"post",
        "title":"Learning JavaScript!",
        "content":"I'm learning JavaScript and super excited!!!"
      },
      {
        "id":3,
        "date":"2016-01-11T22:05:09",
        "modified":"2016-01-11T22:05:09",
        "slug":"rest-api",
        "type":"post",
        "title":"The REST API!",
        "content":"I've started working with the REST API in WordPress, what fun!"
      },
      {
        "id":4,
        "date":"2016-01-12T22:05:09",
        "modified":"2016-01-12T22:05:09",
        "slug":"json-data",
        "type":"post",
        "title":"JSON Data!",
        "content":"So, with the REST API it is posible to pull in WordPress data as pure JSON.  Now I'm figuring out what to do with the data"
      },
      {
        "id":5,
        "date":"2016-01-13T22:05:09",
        "modified":"2016-01-13T22:05:09",
        "slug":"javascript-project",
        "type":"post",
        "title":"JavaScript Project",
        "content":"I've started working with the REST API in WordPress, what fun!"
      }
    ],
    pages =
    [
      {
        "id":6,
        "date":"2016-01-18T22:05:09",
        "modified":"2016-01-18T22:05:09",
        "slug":"home",
        "type":"page",
        "title":"Home",
        "content":"Welcome to VanillaPress, my JavaScript site!"
      },
      {
        "id":7,
        "date":"2016-01-18T22:05:09",
        "modified":"2016-01-18T22:05:09",
        "slug":"about",
        "type":"page",
        "title":"About",
        "content":"A little about me!"
      },
      {
        "id":8,
        "date":"2016-01-18T22:05:09",
        "modified":"2016-01-18T22:05:09",
        "slug":"blog",
        "type":"page",
        "title":"Blog",
        "content":"Please enjoy my posts"
      },
      {
        "id":9,
        "date":"2016-01-18T22:05:09",
        "modified":"2016-01-18T22:05:09",
        "slug":"contact",
        "type":"page",
        "title":"Contact",
        "content":"Drop me a line with any questions :)"
      }
    ],
    settings = {
      "editorHidden":"true"
    },
    data = {
      "posts": posts,
      "pages": pages,
      "settings": settings
    };
;/**
 * Helper file for extra helper functions
 */

/**
 * Main helper object
 */
var helpers = {};


/**
 * Creates a list item with a link inside for menus
 *
 * @param {Object} contentObj Page object to create menu item for
 * @return {Object} menuItemEl List item DOM object
 */
 helpers.createMenuItem = function( contentObj ) {

   var menuItemEl = document.createElement( 'li' );

   menuItemEl.appendChild( helpers.createLink( contentObj ) );

   return menuItemEl;

 };

/**
 * Creates link
 *
 * @param {Object} contentObj Content object to create link for
 * @return {Object} linkEl Link object
 */
helpers.createLink = function( contentObj ) {

  var linkEl = document.createElement( 'a' ),
     linkTitle = document.createTextNode( contentObj.title );

  if ( 'home' !== contentObj.slug ) {
    linkEl.href = '#' + contentObj.slug;
  } else {
    linkEl.href = '#';
  }
  linkEl.appendChild( linkTitle );

  return linkEl;

};

/**
 * Gets the main menu element
 * @return {Object} Main menu DOM object
 */
helpers.getMainMenuEl = function(){
 return document.querySelector( '#mainNav ul' );
};

/**
 * Gets page title from the DOM
 * @return {Object} Main page title DOM object
 */
helpers.getPageTitleEl = function() {

  return document.getElementById( 'pageTitle' );

};

/**
 * Get links in the view
 * @return {Object} All links in the view
 */
helpers.getLinks = function() {

  return document.querySelectorAll( 'a' );

};


/**
 * Gets page content from the DOM
 * @return {Object} Main content DOM object
 */
helpers.getPageContentEl = function() {

  return document.getElementById( 'pageContent' );

};

/**
 * Gets editor Element in the DOM
 * @return {Object} Main editor DOM object
 */
helpers.getEditorEl = function() {

  return document.getElementById( 'editor' );

};

/**
 * Gets editor toggle Element in the DOM
 * @return {Object} Main toggle element
 */
helpers.getEditorToggleEl = function() {
  return document.getElementById( 'editorToggle' );
};

/**
 * Gets editor toggle link Element in the DOM
 * @return {Object} Main toggle link
 */
helpers.getEditorToggleLink = function() {
  return document.querySelector( '#editorToggle a' );
};

/**
 * Gets editor title form element
 * @return {Object} Title form element
 */
helpers.getEditorTitleEl = function() {
  return document.getElementById( 'editTitle' );
};

/**
 * Gets editor content form element
 * @return {Object} Content form element
 */
helpers.getEditorContentEl = function() {
  return document.getElementById( 'editContent' );
};

/**
 * Gets editor form update button
 * @return {Object} Content form element
 */
helpers.getEditorUpdateBtnEl = function() {
  return document.getElementById( 'editUpdateBtn' );
};
;/**
 * Model file for working with data
 */

/**
 * Main Model Object
 *
 */
var model = {};

/**
 * Initializes the Model
 *
 */
model.init = function() {

  if( false === model.checkLocalStore() ) {
      model.updateLocalStore( data );
  }

};


/**
 * Get a single post or page based on the url slug
 *
 * @param {string} slug The slug for the post
 * @return {Object} contentObj Single post or page
 *
 */
model.getContent = function( slug ) {

  var contentObj = model.getPost( slug );


  // If post is not found, search pages
  if( null === contentObj ) {
    contentObj = model.getPage( slug );
  }

  // If page not found, assign 404 error
  if( null === contentObj ) {
    contentObj = {
        title: '404 Error',
        content: 'Content not found'
    };
  }

  return contentObj;

};


/**
 * Get a single post or page based on the current url
 *
 * @return {Object} contentObj Single post or page
 *
 */
model.getCurrentContent = function() {

  var slug = router.getSlug(),
      contentObj = model.getContent( slug );

  return contentObj;

};


/**
 * Gets posts from local store
 *
 * @return {Object[]} posts Array of posts
 */
model.getPosts = function() {

  var posts = model.getLocalStore().posts;
  return posts;

};

/**
 * Get a single post based on url slug
 *
 * @param {string} slug The slug for the post
 * @return {Object} post Single post
 *
 */
model.getPost = function( slug ) {

  var posts = model.getLocalStore().posts;

  // Get the post from store based on the slug
  for( i = 0, max = posts.length; i < max; i++  ) {

    if( slug === posts[i].slug ) {
      return posts[i];
    }

  }

  return null;

};

/**
 * Gets pages from local store
 *
 * @return {Object[]} pages Array of page objects
 */
model.getPages = function() {

  var pages = model.getLocalStore().pages;
  return pages;

};

/**
 * Get a single page based on url slug
 *
 * @param {string} slug The slug for the page
 * @return {Object} page  Single page object
 *
 */
model.getPage = function( slug ) {

  var pages = model.getLocalStore().pages;

  if( null === slug ) slug = 'home';

  // Get the post from store based on the slug
  for( i = 0, max = pages.length; i < max; i++  ) {

   if( slug === pages[i].slug ) {
     return pages[i];
   }

  }

  return null;

};


/**
 * Updates post or page in local store
 *
 * @param {Object} contentObj Content object to update
 */
model.updateContent = function( contentObj ) {

  var store = model.getLocalStore(),
      date = new Date();

  if( 'post' === contentObj.type ) {
    store.posts.forEach( function( post ) {
      if( contentObj.id === post.id ) {
        post.title = contentObj.title;
        post.content = contentObj.content;
        post.modified = date.toISOString();
      }
    });
  }

  if ( 'page' === contentObj.type ) {
    store.pages.forEach( function( page ) {
      if( contentObj.id === page.id ) {
        page.title = contentObj.title;
        page.content = contentObj.content;
        page.modified = date.toISOString();
      }
    });
  }


  model.updateLocalStore( store );

};


/**
 * Updates if editor is hidden
 *
 * @param {Boolean} hidden If editor is hidden or not
 */
model.updateEditorHidden = function( isHidden ) {

  var store = model.getLocalStore();

  store.settings.editorHidden = isHidden;
  model.updateLocalStore( store );

};

/**
 * Gets local store setting for if editor is hidden
 *
 * @return {Boolean} hidden A boolean for if editor is hidden
 */
model.getEditorHidden = function() {

  var store = model.getLocalStore();

  return store.settings.editorHidden;

};

/**
 * Checks if local store already exists
 *
 * @return {Boolean} Boolean value for if local store already exists
 */
model.checkLocalStore = function() {

  var store = model.getLocalStore();

  if ( null === store ) {
    return false;
  } else {
    return true;
  }

};


/**
 * Gets content from local store
 *
 * @return {Object} store Native JavaScript object from local store
 */
model.getLocalStore = function() {

  var store = JSON.parse( localStorage.getItem( 'vanillaPress' ) );

  return store;

};

/**
 * Saves temporary store to local storage.
 *
 * @param {Object} store Native JavaScript object with site data
 */
model.updateLocalStore = function( store ) {

  localStorage.setItem( 'vanillaPress', JSON.stringify( store ) );

};

/**
 * Deletes data from local storage
 *
 */
model.removeLocalStore = function() {

  localStorage.removeItem( 'vanillaPress' );

};
;/**
 * Router file for managing url changes
 */

/**
 * The main router object.
 *
 */
var router = {};

/**
 * Initializes the Router
 *
 */
router.init = function() {

  router.loadContent();
  router.listenPageChange();

};

/**
 * Gets the slug from the URL
 *
 * @return {string} slug Slug from URL
 */
router.getSlug = function() {

  slug = window.location.hash;

  if( "" === slug ) {

    return null;

  } else {

    return slug.substr( 1 );

  }

};

/**
 * Listener function for URL changes
 *
 */
router.listenPageChange = function() {

  window.addEventListener( 'hashchange', router.loadContent, false );

};


/**
 * Determines whether to load blog posts
 * or single post
 *
 */

router.loadContent = function() {

  var url = router.getSlug(),
      contentObj = model.getContent( url ),
      editorEl = helpers.getEditorEl();

  view.clearContent();

  if( null === url ) {

    view.loadSingleContent( 'home' );

  } else if( 'blog' === url ) {

    view.loadBlogPosts();

  } else {

    view.loadSingleContent( url );

  }

  editor.currentContent = contentObj;
  if( false === editorEl.classList.contains( 'hidden' ) ) {

    editor.loadEditForm( editor.currentContent );

  }

};
;/**
 * View file for displaying content
 */


/**
 * Main view object
 *
 */
var view = {};


/**
 * Calls initial View methods
 *
 */
view.init = function() {

  view.createMainMenu();

};


/**
 * Gets blog posts and appends them to the page
 *
 */
view.loadBlogPosts = function() {

  var posts = model.getPosts(),
      postsMarkup = document.createDocumentFragment(),
      titleEl = helpers.getPageTitleEl(),
      contentEl = helpers.getPageContentEl();


  for ( var i = 0, max = posts.length; i < max; i++ ) {
    postsMarkup.appendChild( view.createPostMarkup( posts[i] ) );
  }

  contentEl.appendChild( postsMarkup );
  titleEl.innerHTML = 'Blog Posts';

};


/**
 * Displays a single post or page based on URL
 *
 */
 view.loadSingleContent = function( slug ) {

   var contentObj = model.getContent( slug ),
       titleEl = helpers.getPageTitleEl(),
       contentEl = helpers.getPageContentEl();


   titleEl.innerHTML = contentObj.title;
   contentEl.innerHTML = contentObj.content;

 };


/**
* Updates the main title and content for a page or post
*
*/
view.updateTitleAndContent = function( contentObj ) {

  view.updateTitle( contentObj.title );
  view.updateContent( contentObj.content );

};

/**
* Updates the main title for a page or post
* @param {String} title The title for a post or page
*/
view.updateTitle = function( title ) {

  var titleEl = helpers.getPageTitleEl();

  titleEl.innerHTML = title;

};


/**
* Updates the main content for a page or post
* @param {String} content The content for a post or page
*/
view.updateContent = function( content ) {

  var contentEl = helpers.getPageContentEl();

  contentEl.innerHTML = content;

};


/**
 * Clears the page title and content from the page
 *
 */
view.clearContent = function() {
  var titleEl = helpers.getPageTitleEl(),
      contentEl = helpers.getPageContentEl();

  titleEl.innerHTML = '';
  contentEl.innerHTML = '';
};


/**
 * Creates Main Menu Links for Pages
 *
 */
 view.createMainMenu = function() {

   var pages = model.getPages(),
       menuMarkup = document.createDocumentFragment(),
       mainMenuEl = helpers.getMainMenuEl();

   for ( var i = 0, max = pages.length; i < max; i++ ) {
     // Create menu markup
     menuMarkup.appendChild( helpers.createMenuItem( pages[i] ) );
   }

   mainMenuEl.appendChild( menuMarkup );

 };


/**
 * Creates Markup for Blog Posts
 *
 * @param {Object} post Post to create markup for
 * @return {Object} articleEl Final post markup
 */
view.createPostMarkup = function( post ) {

  var articleEl = document.createElement( 'article' ),
      titleEl = document.createElement( 'h3' ),
      titleLink = helpers.createLink( post ),
      contentEl = document.createElement( 'div' );

  titleEl.appendChild( titleLink );
  contentEl.appendChild( document.createTextNode( post.content ) );

  articleEl.appendChild( titleEl );
  articleEl.appendChild( contentEl );

  return articleEl;

};
;/**
 * Code for the Editor
 */


/**
 * The main Editor object
 *
 */
var editor = {};

editor.currentContent = '';
editor.unSavedContent = false;

/**
 * Initializes the VanillaPress app
 *
 */

editor.init = function() {

  editor.listenEditorToggle();
  editor.checkEditorHidden();

};


/**
 * Updates local storage for post or page
 *
 */
editor.updateContent = function() {

  event.preventDefault();
  model.updateContent( editor.currentContent );
  editor.unSavedContent = false;
  editor.animateSaveBtn();

};


/**
 * Runs when changes take place to editor title
 *
 */
editor.updateTitle = function() {

  var title = helpers.getEditorTitleEl().value;

  editor.currentContent.title = title;
  editor.unSavedContent = true;
  view.updateTitle( title );

};


/**
 * Runs when changes take place to editor title
 *
 */
editor.updateMainContent = function() {

  var content = helpers.getEditorContentEl().value;

  editor.currentContent.content = content;
  editor.unSavedContent = true;
  view.updateContent( content );

};


/**
 * Dynamically fills the edit form based on the url
 *
 */
editor.loadEditForm = function( contentObj ) {

  var titleForm = helpers.getEditorTitleEl(),
      contentForm = helpers.getEditorContentEl();

  titleForm.value = contentObj.title;
  contentForm.value = contentObj.content;

  if ( 'blog' === contentObj.slug ) {
    contentForm.setAttribute( 'readonly', 'readonly' );
  } else {
    contentForm.removeAttribute( 'readonly' );
  }

  editor.addFormListeners();

};


/**
 * Animates the Update button to mimic saving data
 *
 */
editor.animateSaveBtn = function() {

  var btn = helpers.getEditorUpdateBtnEl(),
      saved = function() {
        setTimeout(function(){
          btn.innerText = 'Update';
        }, 1000);
      };
      saving = function() {
        setTimeout(function(){
          btn.innerText = 'Saved!';
          saved();
        }, 900);
      };

  btn.innerText = 'Saving...';
  saving();

};

/**
 * Adds event listeners for the title and content
 *
 */
 editor.addFormListeners = function() {

   var titleField = helpers.getEditorTitleEl(),
       contentField = helpers.getEditorContentEl(),
       updateBtn = helpers.getEditorUpdateBtnEl(),
       links = helpers.getLinks();

   titleField.addEventListener(
     'input',
     editor.updateTitle,
     false
   );
   contentField.addEventListener(
     'input',
     editor.updateMainContent,
     false
   );
   updateBtn.addEventListener(
     'click',
     editor.updateContent,
     false
   );


   links.forEach( function( link ) {

     link.addEventListener(
       'click',
       editor.protectUnsavedContent,
       false
     );

   });

 };


/**
 * Adds alert if links are clicked with unsaved content
 *
 */
editor.protectUnsavedContent = function() {

  if ( true === editor.unSavedContent ) {

    var confirm = window.confirm( 'You have unsaved content' );

    if ( false === confirm ) {
      event.preventDefault();
    } else {
      editor.unSavedContent = false;
    }

  }

};

/**
 * Listens for the editor toggle button
 *
 */
editor.listenEditorToggle = function() {

  var toggleEl = helpers.getEditorToggleLink();

  toggleEl.addEventListener( 'click', function() {
    editor.toggle();
    event.preventDefault();
  }, false );

};


/**
 * Opens editor if local store has editor visible
 *
 */
editor.checkEditorHidden = function() {

  var isHidden = model.getEditorHidden();

  if( false === isHidden ) {
    editor.toggle();
  }

};

/**
 * Controls the toggle for the editor
 *
 */
editor.toggle = function() {

  var editorEl = helpers.getEditorEl(),
      toggleEl = helpers.getEditorToggleEl(),
      links = helpers.getLinks();

  editor.currentContent = model.getCurrentContent();

  editorEl.classList.toggle( 'hidden' );
  toggleEl.classList.toggle( 'hidden' );

  if( false === toggleEl.classList.contains( 'hidden' ) ) {

    editor.loadEditForm( editor.currentContent );
    model.updateEditorHidden( false );

  } else {

    model.updateEditorHidden( true );

    links.forEach( function( link ) {

      link.removeEventListener(
        'click',
        editor.protectUnsavedContent,
        false
      );

    });

  }

};
;/**
 * Main app file.  Initializes app components.
 */


/**
 * The main app object.
 *
 */
var vanillaPress = {};


/**
 * Initializes the VanillaPress app
 *
 */
vanillaPress.init = function() {

  model.init();
  router.init();
  view.init();
  editor.init();

};

vanillaPress.init();
