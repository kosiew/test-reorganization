/**
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
  console.log( 'Hi, still there?!' );
};

vanillaPress.init();
