'use strict';

const startBtn = document.getElementById( 'timerTrigger' );
const stopBtn = document.getElementById( 'timerCancel' );
const msg = 'Hello!';
const waitLength = 2000;

let timerId;


startBtn.addEventListener( 'click', triggerMsg );
stopBtn.addEventListener( 'click', cancelTimer );


function triggerMsg() {
  console.log( `Wait ${waitLength} milliseconds...` );
  timerId = setTimeout( displayMsg, waitLength );
}

function displayMsg() {
  console.log( 'Done waiting!' );
  console.log( msg );
}

function cancelTimer() {
  clearTimeout( timerId )
  console.clear();
  console.log( 'Timer stopped!!!' );
}
