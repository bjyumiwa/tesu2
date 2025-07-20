document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('puzzle-board');
    const moveCountElement = document.getElementById('move-count');
    const shuffleButton = document.getElementById('shuffle-button');
    const winMessageElement = document.getElementById('win-message');
    const restartButton = document.getElementById('restart-button');
    const timeElapsedElement = document.getElementById('time-elapsed');

    const SIZE = 4;
    const TILE_COUNT = SIZE * SIZE;
    const EMPTY_TILE = TILE_COUNT;
    const TILE_SIZE = 75; // Same as in CSS
    const GAP = 5; // Same as in CSS

    let board = [];
    let initialBoard = []; // To store the board state for restart
    let moves = 0;
    let isGameWon = false;
    let timer = null;
    let timeElapsed = 0;

    function getPosition(index) {
        const col = index % SIZE;
        const row = Math.floor(index / SIZE);
        return {
            x: col * (TILE_SIZE + GAP),
            y: row * (TILE_SIZE + GAP),
        };
    }

    function createTile(number, index) {
        const tile = document.createElement('div');
        if (number === EMPTY_TILE) {
            return null; // Don't create a DOM element for the empty tile
        }
        tile.className = 'tile';
        tile.textContent = number;
        tile.dataset.number = number;
        const { x, y } = getPosition(index);
        tile.style.transform = `translate(${x}px, ${y}px)`;

        tile.addEventListener('click', () => handleTileClick(number));
        return tile;
    }

    function renderBoard() {
        boardElement.innerHTML = '';
        board.forEach((number, index) => {
            const tileElement = createTile(number, index);
            if (tileElement) {
                boardElement.appendChild(tileElement);
            }
        });
    }

    function updateTilePositions() {
        board.forEach((number, index) => {
            if (number !== EMPTY_TILE) {
                const tileElement = boardElement.querySelector(`[data-number='${number}']`);
                const { x, y } = getPosition(index);
                tileElement.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    }

    function startTimer() {
        if (timer) return; // Timer already running
        const startTime = Date.now() - timeElapsed * 1000;
        timer = setInterval(() => {
            timeElapsed = Math.floor((Date.now() - startTime) / 1000);
            timeElapsedElement.textContent = `${timeElapsed}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function resetTimer() {
        stopTimer();
        timeElapsed = 0;
        timeElapsedElement.textContent = `${timeElapsed}s`;
    }

    function handleTileClick(number) {
        if (isGameWon) return;

        // Start timer on first move
        if (moves === 0) {
            startTimer();
        }

        const tileIndex = board.indexOf(number);
        const emptyIndex = board.indexOf(EMPTY_TILE);

        const tileRow = Math.floor(tileIndex / SIZE);
        const tileCol = tileIndex % SIZE;
        const emptyRow = Math.floor(emptyIndex / SIZE);
        const emptyCol = emptyIndex % SIZE;

        const isAdjacent =
            (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
            (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);

        if (isAdjacent) {
            [board[tileIndex], board[emptyIndex]] = [board[emptyIndex], board[tileIndex]]; // Swap
            moves++;
            moveCountElement.textContent = moves;
            updateTilePositions();
            checkWin();
        }
    }

    function isSolvable(arr) {
        let inversions = 0;
        for (let i = 0; i < TILE_COUNT - 1; i++) {
            for (let j = i + 1; j < TILE_COUNT; j++) {
                if (arr[i] !== EMPTY_TILE && arr[j] !== EMPTY_TILE && arr[i] > arr[j]) {
                    inversions++;
                }
            }
        }
        
        const emptyRow = Math.floor(arr.indexOf(EMPTY_TILE) / SIZE);
        // For a 4x4 grid (even width), the puzzle is solvable if:
        // (number of inversions) + (row of the empty space, 1-indexed from the bottom) is even.
        const emptyRowFromBottom = SIZE - emptyRow;
        return (inversions + emptyRowFromBottom) % 2 === 0;
    }

    function resetGame() {
        moves = 0;
        isGameWon = false;
        moveCountElement.textContent = moves;
        winMessageElement.classList.add('hidden');
        resetTimer();

        board = [...initialBoard]; // Restore initial shuffled state
        updateTilePositions();
    }

    function shuffle() {
        moves = 0;
        isGameWon = false;
        moveCountElement.textContent = moves;
        winMessageElement.classList.add('hidden');
        resetTimer();
        board = Array.from({ length: TILE_COUNT }, (_, i) => i + 1);

        do {
            // Fisher-Yates shuffle
            for (let i = board.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [board[i], board[j]] = [board[j], board[i]];
            }
        } while (!isSolvable(board)); // Ensure the generated puzzle is solvable

        initialBoard = [...board]; // Save the initial state for restarting

        if (boardElement.children.length === 0) {
            renderBoard();
        } else {
            updateTilePositions();
        }
    }

    function checkWin() {
        for (let i = 0; i < TILE_COUNT - 1; i++) {
            if (board[i] !== i + 1) {
                return;
            }
        }
        isGameWon = true;
        stopTimer();
        winMessageElement.classList.remove('hidden');
    }

    shuffleButton.addEventListener('click', shuffle);
    restartButton.addEventListener('click', resetGame);

    // Initial game setup
    shuffle();
});