const canvas = document.getElementById('tetrisCanvas');
canvas.width = 300;
canvas.height = 600;
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';

function row_col() {
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 10; c++) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(c * 30, r * 30, 30, 30);
        }
    }
}
row_col();
function draw_piece_test(piece) {
    for (let i = 0; i < piece.shape.length; i++) {
        for (let j = 0; j < piece.shape[i].length; j++) {
            if (piece.shape[i][j] === 1) {
                ctx.fillStyle = piece.color;
                ctx.fillRect((piece.x + j) * 30, (piece.y + i) * 30, 30, 30);
            }
        }
    }
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    row_col();                    
    draw_piece_test(current_piece); 
}
