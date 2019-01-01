const GAME = {};
let openedCards = [];
let movesNumber = 0;
let matchedCounter = 0;
let playerRank = 5;
let playerTime = 0;
let timer = setInterval(function() {
      updateTimer();
    }, 1000);
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
    clearInterval(timer);
    showElements([GAME['modal-container'], GAME['win-modal']]);
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
