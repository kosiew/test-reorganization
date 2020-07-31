'use strict';

const startBtn = document.getElementById( 'timerTrigger' );
const stopBtn = document.getElementById( 'timerCancel' );
const clearBtn = document.getElementById( 'consoleClear' );
const waitLength = 2000;

let timerId;


startBtn.addEventListener( 'click', triggerMsgRepeater );
stopBtn.addEventListener( 'click', cancelTimer );
clearBtn.addEventListener( 'click', clearConsole );

function triggerMsgRepeater() {
  console.log( `Wait ${waitLength} milliseconds...` );
  timerId = setInterval( displayMsg, waitLength );
}

function displayMsg() {
  console.log( `✔️ ${waitLength} milliseconds reached` );
  console.log( `🔁 Wait ${waitLength} more milliseconds...` );
}

function cancelTimer() {
  clearInterval( timerId )
  // console.clear();
  console.log( '🛑 Repeating Timer stopped!!!' );
}

function clearConsole() {
  console.clear();
}
