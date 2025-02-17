const cardsArray = [
    {name: 'or_gate', img:"or_gate.png"},
    {name: 'or', img:"or.jpeg"},
    {name: 'and_gate', img:"and_gate.jpg"},
    {name: 'and', img:"and.png"},
    {name: 'not_gate', img:"not_gate.png"},
    {name: 'not', img:"not.jpg"},
    //{name: 'circuit q1', img:},
    //{name: 'circuit a1', img:},
    //{name: 'circuit q2', img:},
    //{name: 'circuit a2', img:},
    //{name: 'circuit q3', img:},
    //{name: 'circuit a3', img:}
];

let gameGrid = [...cardsArray]; //the '...' is a spread operator separating the array into individual els
gameGrid.sort(() => 0.5 - Math.random());

let firstCard = null;
let secondCard = null;
let lockBoard = false;

gameGrid.forEach(item => {
    /*creating a div element in the html with class "card"*/
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name;

    /*creating a div element in the html with class "front"*/
    const frontFace = document.createElement('div');
    frontFace.classList.add('front');
    frontFace.innerHTML = '?';

    /*creating a div element in the html with class "back" and img from object*/
    const backFace = document.createElement('img');
    backFace.src = item.img;
    backFace.classList.add('back');

    /*"front" and "back" now within the element "card"*/
    card.appendChild(frontFace);
    card.appendChild(backFace);

    /*"card" now within "gameBoard"*/
    gameBoard.appendChild(card);

    card.addEventListener('click', flipCard);
});

function flipCard() {
    if (lockBoard || this == firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

function checkMatch() {
    if (connectedPairs(firstCard.dataset.name, secondCard.dataset.name)) {
        disableCards();
    } else {
        unflipCards();
    }
}

function connectedPairs(name1, name2) {
    const pairs = {
        'or_gate': 'or',
        'and_gate': 'and',
        'not_gate': 'not',
        'circuit q1': 'circuit a1',
        'circuit q2': 'circuit a2',
        'circuit q3': 'circuit a3'
    };
    return (pairs[name1] === name2) || (pairs[name2] == name1);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}