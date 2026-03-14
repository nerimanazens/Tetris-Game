const canvas = document.getElementById('tetrisCanvas');
canvas.width = 300;
canvas.height = 600;
const ctx = canvas.getContext('2d');
const BLOCK_SIZE = 30;

ctx.fillStyle = 'black';

function row_col() {
    for (let r = 0; r < VISIBLE_ROWS; r++) {
        for (let c = 0; c < BOARD_WIDTH; c++) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}
row_col();

function draw_block(x, y, color, alpha = 1, strokeColor = 'black') {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.restore();
}

function draw_piece_test(piece) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j] === 1) {
                const boardY = piece.y + i;

                if (boardY < HIDDEN_ROWS || boardY >= BOARD_HEIGHT) continue;

                draw_block((piece.x + j) * BLOCK_SIZE, (boardY - HIDDEN_ROWS) * BLOCK_SIZE, piece.color);
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    row_col();

    // Board
    for (let r = HIDDEN_ROWS; r < BOARD_HEIGHT; r++) {
        for (let c = 0; c < BOARD_WIDTH; c++) {
            if (board[r][c] !== 0) draw_block(c * BLOCK_SIZE, (r - HIDDEN_ROWS) * BLOCK_SIZE, board[r][c]);
        }
    }

    const ghost = get_ghost_piece();
    if (ghost.y !== current_piece.y) {
        for (let i = 0; i < ghost.shape.length; i++) {
            for (let j = 0; j < ghost.shape[i].length; j++) {
                if (ghost.shape[i][j] === 1) {
                    const boardY = ghost.y + i;

                    if (boardY < HIDDEN_ROWS || boardY >= BOARD_HEIGHT) continue;

                    draw_block(
                        (ghost.x + j) * BLOCK_SIZE,
                        (boardY - HIDDEN_ROWS) * BLOCK_SIZE,
                        current_piece.color,
                        0.2,
                        current_piece.color
                    );
                }
            }
        }
    }

    draw_piece_test(current_piece);
    draw_status_overlay();
    draw_next();
    draw_hold();
}

function draw_status_overlay() {
    if (!isPaused && !isCountingDown) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isCountingDown && countdownValue !== null) {
        ctx.font = 'bold 72px monospace';
        ctx.fillText(String(countdownValue), canvas.width / 2, canvas.height / 2);
        return;
    }

    if (isPaused) {
        ctx.font = 'bold 36px monospace';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('holdCanvas');
const holdCtx = holdCanvas.getContext('2d');

function draw_preview(previewCtx, previewCanvas, piece) {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.fillStyle = '#111';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    if (piece) {
        const cols = piece.shape[0].length;
        const rows = piece.shape.length;
        const blockSize = 25;
        const offsetX = (previewCanvas.width - cols * blockSize) / 2;
        const offsetY = (previewCanvas.height - rows * blockSize) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (piece.shape[i][j] === 1) {
                    previewCtx.fillStyle = piece.color;
                    previewCtx.fillRect(offsetX + j * blockSize, offsetY + i * blockSize, blockSize, blockSize);
                    previewCtx.strokeStyle = '#000';
                    previewCtx.strokeRect(offsetX + j * blockSize, offsetY + i * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}

function draw_next() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = '#111';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    const slotHeight = 80;
    const blockSize = 20;

    next_pieces.forEach((piece, index) => {
        if (!piece) return;
        const cols = piece.shape[0].length;
        const rows = piece.shape.length;
        const offsetX = (nextCanvas.width - cols * blockSize) / 2;
        const slotTop = index * slotHeight;
        const offsetY = slotTop + (slotHeight - rows * blockSize) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (piece.shape[i][j] === 1) {
                    nextCtx.fillStyle = piece.color;
                    nextCtx.fillRect(offsetX + j * blockSize, offsetY + i * blockSize, blockSize, blockSize);
                    nextCtx.strokeStyle = '#000';
                    nextCtx.strokeRect(offsetX + j * blockSize, offsetY + i * blockSize, blockSize, blockSize);
                }
            }
        }
    });
}

function draw_hold() {
    draw_preview(holdCtx, holdCanvas, hold_piece);
}