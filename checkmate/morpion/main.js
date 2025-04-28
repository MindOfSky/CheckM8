const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('gameStatus');
const endScreen = document.getElementById('gameEnd');
const endMessage = document.getElementById('endGameStatus');
const reloadBtn = document.getElementById('reloadGame');

let currentPlayer = 'X';
let gameActive = true;

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
    if (!gameActive) return;
    const cell = e.target;
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(`${currentPlayer} a gagné !`);
        return;
    } else if (isDraw()) {
        endGame("Match nul !");
        return;
    }
    currentPlayer = switchPlayer(currentPlayer);
    if (currentPlayer === 'O') {
        setTimeout(botPlay, 300);
    }
}

function botPlay() {
    let bestScore = -Infinity;
    let move;
    cells.forEach(cell => {
        if (cell.textContent === '') {
            cell.textContent = 'O'; // Bot simule son coup
            let score = minimax(false);
            cell.textContent = ''; // On défait la simulation
            if (score > bestScore) {
                bestScore = score;
                move = cell;
            }
        }
    });

    if (move) {
        placeMark(move, currentPlayer);
    }

    if (checkWin(currentPlayer)) {
        endGame(`${currentPlayer} a gagné !`);
        return;
    } else if (isDraw()) {
        endGame("Match nul !");
        return;
    }
    currentPlayer = switchPlayer(currentPlayer);
}

function minimax(isMaximizing) {
    if (checkWin('O')) return 10;
    if (checkWin('X')) return -10;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        cells.forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = 'O';
                let score = minimax(false);
                cell.textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        cells.forEach(cell => {
            if (cell.textContent === '') {
                cell.textContent = 'X';
                let score = minimax(true);
                cell.textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function placeMark(cell, player) {
    cell.textContent = player;
    cell.removeEventListener('click', handleClick);
    statusText.textContent = `C'est au tour du joueur ${player === 'X' ? '2' : '1'} !`;
}

function switchPlayer(player) {
    return player === 'X' ? 'O' : 'X';
}

function checkWin(player) {
    const winCombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return winCombos.some(combo =>
        combo.every(index => cells[index].textContent === player)
    );
}

function isDraw() {
    return Array.from(cells).every(cell => cell.textContent !== '');
}

function endGame(message) {
    gameActive = false;
    endMessage.textContent = message;
    endScreen.style.display = "block";
}

function reloadGame() {
    window.location.reload();
}
