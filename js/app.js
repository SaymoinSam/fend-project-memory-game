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
  localStorage.playerName = GAME['player-name'].value || 'Guest';
  GAME['player-name'].value = '';
  hideElements([GAME['modal-container'], GAME['name-modal']]);
  play(false, localStorage.playerName);
}
GAME['continue-modal'].onclick = function(e) {
  if(e.target.className === 'continue-game') {
    hideElements([GAME['continue-modal'], GAME['modal-container']]);
    play(true);
  }else if(e.target.className === 'new-game') {
    hideElements([GAME['continue-modal']]);
    showElements([GAME['name-modal'], GAME['modal-container']]);
  }
};
if(typeof localStorage.gameState === 'undefined' || localStorage.gameState === 'empty') {
  hideElements([GAME['continue-modal']]);
  showElements([GAME['name-modal'], GAME['modal-container']]);
}else {
  showElements([GAME['continue-modal'], GAME['modal-container']]);
}
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
  restart();
  if(letsContinue) {
    loadGameState();
  }else {
    shuffleCards();
    generateCards();
  }
  function shuffleCards() {
    CARDS.sort(function() {
      return 0.5 - Math.random();
    });
  }
  function generateCards() {
    let fragment = '';
    for(let i = 0; i < 16; i++) {
      fragment += `<li class="card">
        <i class="${CARDS[i]}"></i>
      </li>`;
    }
    GAME['deck'].innerHTML = fragment;
  }
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
    if(openedCards[0].children[0].className === openedCards[1].children[0].className) {
      lockCards();
      matchedCounter++;
    }
    else {
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
        localStorage.gameState = 'empty';
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
  function updateTimer() {
    playerTime += 1;
    GAME['time'].innerHTML = timeString(playerTime);
  }
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
  function timeString(seconds) {
   const TIME = new Date(seconds * 1000);
    return TIME.getMinutes() > 9 ? TIME.getMinutes() : '0' + TIME.getMinutes() +
      ':' + (TIME.getSeconds() > 9 ? TIME.getSeconds() : '0' + TIME.getSeconds());
  }
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
  }
  function handleScore() {
    movesNumber > 20 ? playerRank = 1 :
    movesNumber > 18 ? playerRank = 2 :
    movesNumber > 16 ? playerRank = 3 :
    movesNumber > 14 ? playerRank = 4 :
    playerRank = 5;
    GAME['stars'].innerHTML = '<li><i class="fa fa-star"></i></li>'.repeat(playerRank);
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
  document.body.onkeydown = function(e) {
    if(e.keyCode === 40 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 37) {
      moveSelector(e.keyCode);
    }
    else if(e.keyCode === 13) {
      GAME['deck'].children[selectIndex].click();
    }

  };
  GAME['restart'].onclick = function() {
    restart();
  };
  GAME['play-again'].onclick = function() {
    hideElements([GAME['modal-container'], GAME['win-modal']]);
    play(false, localStorage.playerName);
  };
}