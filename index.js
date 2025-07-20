const board = document.getElementById('puzzle-board');
const moveCount = document.getElementById('move-count');
const timeElapsed = document.getElementById('time-elapsed');
const winMessage = document.getElementById('win-message');
let tiles = [];
let emptyIndex = 15;
let moves = 0;
let time = 0;
let timerInterval;

function createTiles() {
  tiles = [];
  board.innerHTML = '';
  for (let i = 0; i < 15; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = i + 1;
    tile.dataset.index = i;
    board.appendChild(tile);
    tiles.push(tile);
  }

  const emptyTile = document.createElement('div');
  emptyTile.className = 'tile empty';
  emptyTile.dataset.index = 15;
  board.appendChild(emptyTile);
  tiles.push(emptyTile);
}

function shuffleTiles() {
  let numbers = [...Array(15).keys()].map(i => i + 1);
  do {
    numbers = numbers.sort(() => Math.random() - 0.5);
  } while (!isSolvable(numbers));
  numbers.push(null);

  for (let i = 0; i < 16; i++) {
    const tile = tiles[i];
    const number = numbers[i];
    if (number === null) {
      tile.className = 'tile empty';
      tile.textContent = '';
      emptyIndex = i;
    } else {
      tile.className = 'tile';
      tile.textContent = number;
    }
  }

  moves = 0;
  moveCount.textContent = moves;
  time = 0;
  timeElapsed.textContent = time;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    timeElapsed.textContent = time;
  }, 1000);

  winMessage.classList.add('hidden');
}

function isSolvable(arr) {
  let invCount = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) invCount++;
    }
  }
  const emptyRow = 4 - Math.floor(arr.indexOf(null) / 4);
  return (invCount + emptyRow) % 2 === 0;
}

function handleTileClick(e) {
  const clicked = e.target;
  const index = [...tiles].indexOf(clicked);
  if (isAdjacent(index, emptyIndex)) {
    swapTiles(index, emptyIndex);
    moves++;
    moveCount.textContent = moves;
    if (checkWin()) {
      winMessage.classList.remove('hidden');
      clearInterval(timerInterval);
    }
  }
}

function isAdjacent(i1, i2) {
  const row1 = Math.floor(i1 / 4), col1 = i1 % 4;
  const row2 = Math.floor(i2 / 4), col2 = i2 % 4;
  return (Math.abs(row1 - row2) + Math.abs(col1 - col2)) === 1;
}

function swapTiles(i1, i2) {
  const tempText = tiles[i1].textContent;
  tiles[i1].textContent = tiles[i2].textContent;
  tiles[i2].textContent = tempText;

  tiles[i1].classList.toggle('empty');
  tiles[i2].classList.toggle('empty');

  emptyIndex = i1;
}

function checkWin() {
  for (let i = 0; i < 15; i++) {
    if (tiles[i].textContent != i + 1) return false;
  }
  return true;
}

document.getElementById('shuffle-button').addEventListener('click', shuffleTiles);
document.getElementById('restart-button').addEventListener('click', () => {
  createTiles();
  shuffleTiles();
});
document.getElementById('newgame-button').addEventListener('click', () => {
  createTiles();
  shuffleTiles();
});

board.addEventListener('click', handleTileClick);

createTiles();
