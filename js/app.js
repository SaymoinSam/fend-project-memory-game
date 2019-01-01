// TODO: create an empty object game and store in it all of the elements with classes
const GAME = {};
Array.prototype.forEach.call(document.querySelectorAll('*'), function(element) {
  element.classList[0] && (GAME[`${element.classList[0]}`] = element);
});
/**
* @description shows an element
* @param {array} elements - the elements to show
*/
function showElements(elements) {
  elements.forEach(function(element) {
    element.classList.remove('hidden');
  });
}
/**
* @description hides an element
* @param {array} elements - the elements to hide
*/
function hideElements(elements) {
  elements.forEach(function(element) {
    element.classList.add('hidden');
  });
}
// TODO: add an event listener of clicks to the `'.set-name'` button element
GAME['set-name'].onclick = function() {
  // TODO: add a property `playerName` to the `localStorage` object
  localStorage.playerName = GAME['player-name'].value || 'Guest';
  GAME['player-name'].value = '';
  // TODO: hide the `'name-modal'` from the screen
  hideElements([GAME['modal-container'], GAME['name-modal']]);
  // TODO: start a new game with the already set `playerName`
  play(false, localStorage.playerName);
}
// TODO: add an event listener of clicks to the `'.continue-modal'` div element
GAME['continue-modal'].onclick = function(e) {
  // TODO: check if the player clicked `'.continue-game'` button
  if(e.target.className === 'continue-game') {
    // TODO: hide the `'.continue-modal'` from the screen
    hideElements([GAME['continue-modal'], GAME['modal-container']]);
    // TODO: continue the game
    play(true);
  // TODO: check if the player clicked `'.new-game'` button
  }else if(e.target.className === 'new-game') {
    //TODO: hide the `'.continue-modal'` and show the `'.name-modal'`
    hideElements([GAME['continue-modal']]);
    showElements([GAME['name-modal'], GAME['modal-container']]);
  }
};
// TODO: check if there is an unfinished game then show the continue button
if(typeof localStorage.gameState === 'undefined' || localStorage.gameState === 'empty') {
  // TODO: hide the `'.continue-modal'` and show the `'.name-modal'`
  hideElements([GAME['continue-modal']]);
  showElements([GAME['name-modal'], GAME['modal-container']]);
}else {
  // TODO: show the `'.continue-modal'` to the screen
  showElements([GAME['continue-modal'], GAME['modal-container']]);
}
/**
* @description starts the game
* @param {boolean} letsContinue - the game should continue
* @param {string} playerName - the name of the player
*/
function play(letsContinue, playerName) {
  let playerRank,
    playerTime,
    openedCards,
    matchedCounter,
    movesNumber,
    selectIndex,
    timer = setInterval(function() {
      updateTimer();
      saveGameState();
    }, 1000);
  const CARDS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle',
    'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt',
    'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];
  // TODO: initialize all of the variables to their starting value
  restart();
  // TODO: check if the game should continue then load the saved game state
  if(letsContinue) {
    loadGameState();
  // TODO: shuffle the cards and generate the html content
  }else {
    shuffleCards();
    generateCards();
  }
  /**
  * @description shuffles the cards array
  */
  function shuffleCards() {
    CARDS.sort(function() {
      return 0.5 - Math.random();
    });
  }
  /*
  * TODO: loop through each card and create its HTML and
  * add each card's HTML to the page
  */
  function generateCards() {
    // TODO: avoid changing the DOM each time the loop iterates
    let fragment = '';
    for(let i = 0; i < 16; i++) {
      fragment += `<li class="card">
        <i class="${CARDS[i]}"></i>
      </li>`;
    }
    // TODO: only change the DOM once
    GAME['deck'].innerHTML = fragment;
  }
  // TODO: set up an event listener for a card. If a card is clicked:
  GAME['deck'].onclick = function(e) {
    // TODO: ignore the click event if the card is already matched or opened
    if(e.target.nodeName !== 'LI' || e.target.className.indexOf('match') > -1 || e.target.className.indexOf('open') > -1) {
      return;
    }
    const CARD = e.target;
    // TODO: display the card's symbol
    showCard(CARD);
    // TODO: add the card to a *list* of 'open' cards
    addCard(CARD);
    // TODO: if the list already has another card, check to see if the two cards match
    openedCards.length > 1 && checkCards();
  };
  /**
  * @description shows the card by adding two classes to it
  * @param {object} card - the DOM object of the card
  */
  function showCard(card) {
    card.className = ('card open show');
  }
  /**
  * @description adds the card to the opened cards list
  * @param {object} card - the DOM object of the card
  */
  function addCard(card) {
    openedCards.push(card);
  }
  // TODO: add an object property leaderBoard to the localStorage object
  localStorage.leaderBoard = localStorage.leaderBoard || JSON.stringify([
    { name: 'Bob', time: 72, rank: 5 },
    { name: 'Maria', time: 91, rank: 4 },
    { name: 'John', time: 80, rank: 4 },
    { name: 'Mark', time: 144, rank: 3 },
    { name: 'Jean', time: 135, rank: 2 }
  ]);
  /**
  * @description checks the cards for match and handles the components of the game
  */
  function checkCards() {
    // TODO: check if the cards do match, lock the cards in the open position
    if(openedCards[0].children[0].className === openedCards[1].children[0].className) {
      lockCards();
      matchedCounter++;
    }
    // TODO: if the cards do not match, remove the cards from the list and hide the card's symbol
    else {
      hideCards();
    }
    // TODO: increment the move counter and display it on the page
    updateCounter();
    // TODO: display a number of stars on the page depending on the number of noves
    handleScore();
    // TODO: check if all cards have matched
    if(matchedCounter === 8) {
      // TODO: wait 0.3 second(animation time plus 0.05 second) to finish the game
      setTimeout(function() {
        const LEADER_BOARD = JSON.parse(localStorage.leaderBoard),
          STAR_CODE = '<i class="fa fa-star"></i>';
        let leaderBoardCode = '<table><caption>Leaderboard</caption><tr><th>Name</th><th>Time</th><th>Rank</th></tr>';
        // TODO: iterate over the `LEADER_BOARD` array and compare to set the correct place of the player
        for(let i = 0; i < 5; i++) {
          if(LEADER_BOARD[i].rank <= playerRank && LEADER_BOARD[i].time >= playerTime) {
            // TODO: set the player score at the right position
            LEADER_BOARD.splice(i, 0, {
              name: playerName,
              time: playerTime,
              rank: playerRank
            });
            // TODO: get rid of the last score(the lower one) so we keep only the top five
            LEADER_BOARD.pop();
            break;
          }
        }
        // TODO: generate the html code for the `'.leader-board'` element
        LEADER_BOARD.forEach(function(item) {
          leaderBoardCode += `<tr><td>${item.name}</td>
            <td>${timeString(item.time)}</td>
            <td>${STAR_CODE.repeat(item.rank)}</td></tr>`;
        });
        // TODO: save the `leaderBoard` to the `localStorage` object
        localStorage.leaderBoard = JSON.stringify(LEADER_BOARD);
        // TODO: update the `'.leader-board'` element's content
        GAME['leader-board'].innerHTML = `${leaderBoardCode}</table>`;
        // TODO: update the `'.modal-infos'` element's content
        GAME['modal-infos'].innerHTML = `With ${movesNumber} Moves and ${playerRank} Stars in about ${timeString(playerTime)}`;
        // TODO: stop the timer
        clearInterval(timer);
        // TODO: clear the game state
        localStorage.gameState = 'empty';
        // TODO: show the `'.win-modal'`
        showElements([GAME['modal-container'], GAME['win-modal']]);
      }, 300);
    }
  }
  /**
  * @description lock the two cards in the `openedCards` list
  */
  function lockCards() {
    openedCards[0].classList.add('right');
    openedCards[1].classList.add('right');
    // TODO: wait 0.25 second(animation time)
    setTimeout(function() {
      openedCards[0].className = 'card match';
      openedCards[1].className = 'card match';
      openedCards[0].classList.remove('right');
      openedCards[1].classList.remove('right');
      openedCards = [];
    }, 250);
  }
  /**
  * @description hide the two cards in the `openedCards` list
  */
  function hideCards() {
    openedCards[0].classList.add('wrong');
    openedCards[1].classList.add('wrong');
    // TODO: wait 0.25 second(animation time)
    setTimeout(function() {
      openedCards[0].className = 'card';
      openedCards[1].className = 'card';
      openedCards[0].classList.remove('wrong');
      openedCards[1].classList.remove('wrong');
      openedCards = [];
    }, 250);
  }
  /**
  * @description increments the `moves` and updates it's HTML element's content
  */
  function updateCounter() {
    GAME['moves'].innerHTML = ++movesNumber;
  }
  /**
  * @description increments the `playerTime` and updates it's HTML element's content
  */
  function updateTimer() {
    playerTime += 1;
    GAME['time'].innerHTML = timeString(playerTime);
  }
  /**
  * @description creates and saves the `gameState` to the `localStorage` object
  */
  function saveGameState() {
    const CLEAN_DECK = GAME['deck'].innerHTML.replace(' open show', ''),
      gameState = {
        playerTime,
        playerRank,
        matchedCounter,
        movesNumber,
        deck: CLEAN_DECK
      };
    localStorage.gameState = JSON.stringify(gameState);
  }
  /**
  * @description loads the `gameState` from the `localStorage` object
  */
  function loadGameState() {
    const GAME_STATE = JSON.parse(localStorage.gameState);
    playerTime = GAME_STATE.playerTime;
    playerRank = GAME_STATE.playerRank;
    matchedCounter = GAME_STATE.matchedCounter;
    openedCards = [];
    movesNumber = GAME_STATE.movesNumber;
    GAME['deck'].innerHTML = `${GAME_STATE.deck}`;
    GAME['moves'].innerHTML = movesNumber;
    GAME['stars'].innerHTML = '<li><i class="fa fa-star"></i></li>'.repeat(playerRank);

  }
  /**
  * @description creates a time string of minutes and seconds
  * @param {number} seconds - the number of seconds
  * @returns {string} the time string format 'minutes:seconds'
  */
  function timeString(seconds) {
   const TIME = new Date(seconds * 1000);
    return TIME.getMinutes() > 9 ? TIME.getMinutes() : '0' + TIME.getMinutes() +
      ':' + (TIME.getSeconds() > 9 ? TIME.getSeconds() : '0' + TIME.getSeconds());
  }
  /**
  * @description calls another function selectElement and passes a number depending on the key
  * @param {number} key - the `keyCode` of the event object
  */
  function moveSelector(key) {
    switch(key) {
      case 37: selectElement(-1); break;
      case 38: selectElement(-4); break;
      case 39: selectElement(1); break;
      default: selectElement(4);
    }
  }
  /**
  * @description handles the selecting process
  * @param {number} step - the step to take from the current selecting index
  */
  function selectElement(step) {
    selectIndex + step === 16 ?  selectIndex = 0 :
    selectIndex + step === -1 ? selectIndex = 15 :
    selectIndex + step < -1 ?  selectIndex += 12 :
    selectIndex + step > 16 ?  selectIndex -= 12 :
    selectIndex += step;
    for(let i = 0; i < 16; i++) {
      GAME['deck'].children[i].classList.remove('selected');
    }
    GAME['deck'].children[selectIndex].classList.add('selected');
  }
  /**
  * @description handles the score precess
  */
  function handleScore() {
    movesNumber > 20 ? playerRank = 1 :
    movesNumber > 18 ? playerRank = 2 :
    movesNumber > 16 ? playerRank = 3 :
    movesNumber > 14 ? playerRank = 4 :
    playerRank = 5;
    GAME['stars'].innerHTML = '<li><i class="fa fa-star"></i></li>'.repeat(playerRank);
  }
  /**
  * @description restarts the game
  */
  function restart() {
    generateCards();
    playerTime = 0;
    playerRank = 5;
    matchedCounter = 0;
    openedCards = [];
    GAME['moves'].innerHTML = 0;
    movesNumber = 0;
    selectIndex = 0;
    GAME['stars'].innerHTML = '<li><i class="fa fa-star"></i></li>'.repeat(5);
  };
  // TODO: add an event listener for keys pressing to the body element
  document.body.onkeydown = function(e) {
    // TODO: if the arrow keys were pressed
    if(e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 37) {
      moveSelector(e.keyCode);
    }
    // TODO: if the enter key was pressed
    else if(e.keyCode === 13) {
      GAME['deck'].children[selectIndex].click();
    }
  };
  // TODO: restart the game if the `'.restart'` button element was clicked
  GAME['restart'].onclick = function() {
    restart();
  };
  // TODO: hide the modal and start a new game with the same `playerName` if the `'.play-again'` button element was clicked
  GAME['play-again'].onclick = function() {
    hideElements([GAME['modal-container'], GAME['win-modal']]);
    play(false, localStorage.playerName);
  };
}