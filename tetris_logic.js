const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 40;
const VISIBLE_ROWS = 20;
const HIDDEN_ROWS = BOARD_HEIGHT - VISIBLE_ROWS;

function createBoard() {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_WIDTH; j++) {
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
    lock_piece: new Audio('../sounds/268822__kwahmah_02__woodblock.wav'),
    game_over: new Audio('../sounds/171672__leszek_szary__failure-2.wav')
}
game_sounds.music.loop = true;

let gameStarted = false;
let isPaused = false;
let isCountingDown = false;
let countdownValue = null;
let countdownTimer = null;
let gameLoopRunning = false;

function stopCountdown() {
    if (countdownTimer !== null) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    isCountingDown = false;
    countdownValue = null;
}

function startGameLoop() {
    if (gameLoopRunning) return;

    gameLoopRunning = true;
    requestAnimationFrame(gameLoop);
}

function startCountdown(onComplete) {
    stopCountdown();
    isCountingDown = true;
    countdownValue = 3;
    render();

    countdownTimer = setInterval(() => {
        countdownValue -= 1;

        if (countdownValue > 0) {
            render();
            return;
        }

        stopCountdown();
        onComplete();
        render();
    }, 1000);
}

document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        document.getElementById('startBtn').disabled = true;
        startGameLoop();
        startCountdown(() => {
            lastTime = performance.now();
            game_sounds.music.play();
        });
    }
});





const pieceKeys = Object.keys(pieces);
let bag = [];

function getSpawnY(pieceKey) {
    return pieceKey === 'I' ? HIDDEN_ROWS - 1 : HIDDEN_ROWS - 2;
}

function createPiece(pieceKey, x = 3, y = getSpawnY(pieceKey)) {
    const piece = pieces[pieceKey];

    return {
        type: pieceKey,
        shape: piece.shape.map(row => [...row]),
        color: piece.color,
        x,
        y
    };
}

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
    return createPiece(pieceKey);
}

const NEXT_PIECES_COUNT = 6;
let next_pieces = [];
for (let i = 0; i < NEXT_PIECES_COUNT; i++) next_pieces.push(getRandomPiece());

function spawnNextPiece() {
    const piece = next_pieces.shift();
    next_pieces.push(getRandomPiece());

    return {
        ...piece,
        shape: piece.shape.map(row => [...row]),
        x: 3,
        y: getSpawnY(piece.type)
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

    game_sounds.lock_piece.play();
    canHold = true;
}

let lastTime = 0;
let dropInterval = 1000;

function gameLoop(timestamp) {
    if (!gameStarted) {
        gameLoopRunning = false;
        return;
    }

    if (!isPaused && !isCountingDown && timestamp - lastTime >= dropInterval) {
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
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
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
let lines = 0;
let score = 0;
let level = 1;

function clear_lines() {
    let cleared = 0;

    for (let r = BOARD_HEIGHT - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(new Array(BOARD_WIDTH).fill(0));
            r++;
            cleared++;
        }
    }

    if (cleared > 0) {
        lines += cleared;

        const points = [0, 100, 300, 500, 800];
        score += points[cleared] * level;

        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);

        document.getElementById('lines').textContent = lines;
        document.getElementById('score').textContent = score;
        document.getElementById('level').textContent = level;

        game_sounds.line_clear.currentTime = 0;
        game_sounds.line_clear.play();
    }
}

function game_over() {
    stopCountdown();
    game_sounds.game_over.play();
    render();
    gameStarted = false;
    isPaused = true;
    game_sounds.music.pause();
    game_sounds.music.currentTime = 0;


    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    document.getElementById('restartBtn').style.display = 'inline-block';
}

function restartGame() {
    stopCountdown();
    board = [];
    createBoard();
    bag = [];
    hold_piece = null;
    canHold = true;
    next_pieces = [];
    for (let i = 0; i < NEXT_PIECES_COUNT; i++) next_pieces.push(getRandomPiece());
    current_piece = spawnNextPiece();
    gameStarted = true;
    isPaused = false;
    lastTime = performance.now();
    document.getElementById('score').textContent = '0';
    document.getElementById('lines').textContent = '0';
    document.getElementById('level').textContent = '0';
    document.getElementById('restartBtn').style.display = 'none';
    game_sounds.music.currentTime = 0;
    startGameLoop();
    startCountdown(() => {
        lastTime = performance.now();
        game_sounds.music.play();
    });
}

document.getElementById('restartBtn').addEventListener('click', restartGame);


let hold_piece = null;
let canHold = true;

function hold() {
    if (!canHold) return;

    if (hold_piece === null) {
        hold_piece = createPiece(current_piece.type, 0, 0);
        current_piece = spawnNextPiece();
    } else {
        const heldType = hold_piece.type;
        hold_piece = createPiece(current_piece.type, 0, 0);
        current_piece = createPiece(heldType, 3, getSpawnY(heldType));
    }

    if (collusion_check(0, 0)) {
        game_over();
        return;
    }

    canHold = false;
    render();
}

function get_ghost_piece() {
    let ghost = { ...current_piece, shape: current_piece.shape.map(r => [...r]) };
    while (!collusion_check_for(ghost, 0, 1)) {
        ghost.y += 1;
    }
    return ghost;
}

function collusion_check_for(piece, offsetX, offsetY) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j] === 1) {
                let newX = piece.x + j + offsetX;
                let newY = piece.y + i + offsetY;
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
                if (newY >= 0 && board[newY][newX] !== 0) return true;
            }
        }
    }
    return false;
}