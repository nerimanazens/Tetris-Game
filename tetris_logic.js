function createBoard() {
    for (let i = 0; i < 20; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i][j] = 0;
        }
    }
    return board;
}
let board = [];
console.log(createBoard(board));

const pieces = {
    I: { shape: [[1, 1, 1, 1]], color: 'cyan' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }
}

const game_sounds = {
    music: new Audio('../sounds/719393__gregorquendel__tetris-theme-korobeiniki-arranged-for-piano.mp3'),
    line_clear: new Audio('../sounds/404764__owlstorm__retro-video-game-sfx-plop.wav'),
}
game_sounds.music.loop = true;

let gameStarted = false;
let isPaused = false;

document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        game_sounds.music.play();
        requestAnimationFrame(gameLoop);
        document.getElementById('startBtn').disabled = true;
    }
});





const pieceKeys = Object.keys(pieces);
let bag = [];

function refill_bag() {
    bag = [...pieceKeys];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
}
function getRandomPiece() {
    if (bag.length === 0) refill_bag();

    const pieceKey = bag.pop();
    const piece = pieces[pieceKey];

    return {
        shape: piece.shape,
        color: piece.color,
        x: 3,
        y: 0
    };
}

function lock_piece() {
    for (let i = 0; i < current_piece.shape.length; i++) {
        for (let j = 0; j < current_piece.shape[i].length; j++) {
            if (current_piece.shape[i][j] === 1) {
                board[current_piece.y + i][current_piece.x + j] = current_piece.color;
            }
        }
    }
}

let lastTime = 0;
let dropInterval = 1000;

function gameLoop(timestamp) {
    if (!isPaused && timestamp - lastTime >= dropInterval) {
        move_piece('down');
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}



function collusion_check(offsetX = 0, offsetY = 0) {
    for (let i = 0; i < current_piece.shape.length; i++) {
        for (let j = 0; j < current_piece.shape[i].length; j++) {
            if (current_piece.shape[i][j] === 1) {
                let newX = current_piece.x + j + offsetX;
                let newY = current_piece.y + i + offsetY;
                if (newX < 0 || newX >= 10 || newY >= 20) return true;
                if (newY >= 0 && board[newY][newX] !== 0) return true;
            }
        }
    }
    return false;
}
function rotate_piece() {
    const oldShape = current_piece.shape;
    const newShape = [];

    for (let j = 0; j < current_piece.shape[0].length; j++) {
        const newRow = [];
        for (let i = current_piece.shape.length - 1; i >= 0; i--) {
            newRow.push(current_piece.shape[i][j]);
        }
        newShape.push(newRow);
    }


    current_piece.shape = newShape;

    if (collusion_check(0, 0)) {
        if (!collusion_check(-1, 0)) {
            current_piece.x -= 1;
        } else if (!collusion_check(1, 0)) {
            current_piece.x += 1;
        } else {
            current_piece.shape = oldShape;
            return;
        }
    }

    render();
}
function clear_lines() {
    for (let r = 19; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {

            board.splice(r, 1);
            board.unshift(new Array(10).fill(0));
            r++;
            game_sounds.line_clear.play();
        }
    }



}
