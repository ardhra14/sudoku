const boardElement = document.getElementById('sudoku-board');
const newGameButton = document.getElementById('new-game');
const solveButton = document.getElementById('solve');

let board = [];
let solution = [];

function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '1');
        cell.appendChild(input);
        boardElement.appendChild(cell);
    }
}

function generateSudoku() {
    // Create a solved Sudoku board
    solution = generateSolution(createEmptyBoard());
    // Create a puzzle by removing numbers
    board = createPuzzle(solution, 40);
    // Display the board
    displayBoard(board);
}

function displayBoard(board) {
    const inputs = boardElement.getElementsByTagName('input');
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (board[row][col] !== 0) {
            inputs[i].value = board[row][col];
            inputs[i].classList.add('fixed');
            inputs[i].disabled = true;
        } else {
            inputs[i].value = '';
            inputs[i].classList.remove('fixed');
            inputs[i].disabled = false;
        }
    }
}

function createEmptyBoard() {
    return Array(9).fill(0).map(() => Array(9).fill(0));
}

function generateSolution(board) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    solveSudoku(board, numbers);
    return board;
}

function solveSudoku(board, numbers) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                shuffle(numbers);
                for (let num of numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board, numbers)) {
                            return true;
                        } else {
                            board[row][col] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function createPuzzle(solution, difficulty) {
    const puzzle = JSON.parse(JSON.stringify(solution));
    let removed = 0;
    while (removed < difficulty) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
    }
    return puzzle;
}

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

newGameButton.addEventListener('click', () => {
    generateSudoku();
});

solveButton.addEventListener('click', () => {
    displayBoard(solution);
});

createBoard();
generateSudoku();
