const GAME = {};

Array.prototype.forEach.call(document.querySelectorAll('*'), function(element) {
  element.classList[0] && (GAME[`${element.classList[0]}`] = element);
});

function showElements(elements) {
  elements.forEach(function(element) {
    element.classList.remove('hidden');
  });
}

function hideElements(elements) {
  elements.forEach(function(element) {
    element.classList.add('hidden');
  });
}

GAME['set-name'].onclick = function() {
  playerName = GAME['player-name'].value || 'Guest';
  GAME['player-name'].value = '';
  hideElements([GAME['modal-container'], GAME['name-modal']]);
  play(false, playerName);
}

showElements([GAME['modal-container'], GAME['name-modal']]);

function play(letsContinue, playerName) {
  let openedCards;
  let movesNumber;
  let matchedCounter;
  let playerRank;
  let playerTime;
  let selectIndex;
  let timer = setInterval(function() {
        updateTimer();
      }, 1000);
  /*
   * Create a list that holds all of your cards
   */
  const CARDS = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor',
    'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle',
    'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt',
    'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];
  /*
   * Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */
  restart();
  function generateCards() {
    let fragment = '';
    for(let i = 0; i < 16; i++) {
      fragment += `<li class="card">
        <i class="${CARDS[i]}"></i>
      </li>`;
    }
    GAME['deck'].innerHTML = fragment;
  }
  function shuffleCards() {
    CARDS.sort(function() {
      return 0.5 - Math.random();
    });
  }
  shuffleCards();
  generateCards();
  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
   */

  GAME['deck'].onclick = function(e) {
    if(e.target.nodeName !== 'LI' || e.target.className.indexOf('match') > -1 || e.target.className.indexOf('open') > -1) {
      return;
    }
    const CARD = e.target;
    showCard(CARD);
    addCard(CARD);
    openedCards.length > 1 && checkCards();
  };

  function showCard(card) {
    card.className = ('card open show');
  }

  function addCard(card) {
    openedCards.push(card);
  }

  localStorage.leaderBoard = localStorage.leaderBoard || JSON.stringify([
    { name: 'Bob', time: 72, rank: 5 },
    { name: 'Maria', time: 91, rank: 4 },
    { name: 'John', time: 80, rank: 4 },
    { name: 'Mark', time: 144, rank: 3 },
    { name: 'Jean', time: 135, rank: 2 }
  ]);

  function checkCards() {
    console.log('checking');
    if(openedCards[0].children[0].className === openedCards[1].children[0].className) {
      console.log('right');
      lockCards();
      matchedCounter++;
    }
    else {
      console.log('wrong');
      hideCards();
    }
    updateCounter();
    handleScore();
    if(matchedCounter === 8) {
      setTimeout(function() {
        const LEADER_BOARD = JSON.parse(localStorage.leaderBoard),
          STAR_CODE = '<i class="fa fa-star"></i>';
        let leaderBoardCode = '<table><caption>Leaderboard</caption><tr><th>Name</th><th>Time</th><th>Rank</th></tr>';
        for(let i = 0; i < 5; i++) {
          if(LEADER_BOARD[i].rank <= playerRank && LEADER_BOARD[i].time >= playerTime) {
            LEADER_BOARD.splice(i, 0, {
              name: playerName,
              time: playerTime,
              rank: playerRank
            });
            LEADER_BOARD.pop();
            break;
          }
        }
        LEADER_BOARD.forEach(function(item) {
          leaderBoardCode += `<tr><td>${item.name}</td>
            <td>${timeString(item.time)}</td>
            <td>${STAR_CODE.repeat(item.rank)}</td></tr>`;
        });
        localStorage.leaderBoard = JSON.stringify(LEADER_BOARD);
        GAME['leader-board'].innerHTML = `${leaderBoardCode}</table>`;
        GAME['modal-infos'].innerHTML = `With ${movesNumber} Moves and ${playerRank} Stars in about ${timeString(playerTime)}`;
        clearInterval(timer);
        showElements([GAME['modal-container'], GAME['win-modal']]);
      }, 300);
    }
  }

  function lockCards() {
    openedCards[0].classList.add('right');
    openedCards[1].classList.add('right');
    setTimeout(function() {
      openedCards[0].className = 'card match';
      openedCards[1].className = 'card match';
      openedCards[0].classList.remove('right');
      openedCards[1].classList.remove('right');
      openedCards = [];
    }, 250);
  }

  function hideCards() {
    openedCards[0].classList.add('wrong');
    openedCards[1].classList.add('wrong');
    setTimeout(function() {
      openedCards[0].className = 'card';
      openedCards[1].className = 'card';
      openedCards[0].classList.remove('wrong');
      openedCards[1].classList.remove('wrong');
      openedCards = [];
    }, 250);
  }

  function updateCounter() {
    GAME['moves'].innerHTML = ++movesNumber;
  }

  function handleScore() {
    movesNumber > 20 ? playerRank = 1 :
    movesNumber > 18 ? playerRank = 2 :
    movesNumber > 16 ? playerRank = 3 :
    movesNumber > 14 ? playerRank = 4 :
    playerRank = 5;
    GAME['stars'].innerHTML = '<li><i class="fa fa-star"></i></li>'.repeat(playerRank);
  }

  function updateTimer() {
    playerTime += 1;
    GAME['time'].innerHTML = timeString(playerTime);
  }

  function timeString(seconds) {
    const TIME = new Date(seconds * 1000);
    return TIME.getMinutes() > 9 ? TIME.getMinutes() : '0' + TIME.getMinutes() +
      ':' + (TIME.getSeconds() > 9 ? TIME.getSeconds() : '0' + TIME.getSeconds());
  }

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

  function moveSelector(key) {
    switch(key) {
      case 37: selectElement(-1); break;
      case 38: selectElement(-4); break;
      case 39: selectElement(1); break;
      default: selectElement(4);
    }
  }

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
    console.log(selectIndex);
  }

  document.body.onkeydown = function(e) {
    // TODO: if the arrow keys were pressed
    if(e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 37) {
      moveSelector(e.keyCode);
    }
    // TODO: if the enter key was pressed
    else if(e.keyCode === 13) {
      GAME['deck'].children[selectIndex].click();
    }
    console.log(e.keyCode);
  };

  GAME['restart'].onclick = function() {
    restart();
  };

  GAME['play-again'].onclick = function() {
    hideElements([GAME['modal-container'], GAME['win-modal']]);
    play();
  };
}
