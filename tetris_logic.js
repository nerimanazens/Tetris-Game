function createBoard(){
    for(let i=0;i<20;i++){
        board[i]=[];
        for(let j=0;j<10;j++){
            board[i][j]=0;
        }
    }
    return board;
}
let board=[];
console.log(createBoard(board));

const pieces={
    I:{shape :[[1,1,1,1]],color:'cyan'},
    J:{shape:[[1,0,0],[1,1,1]],color:'blue'},
    L:{shape:[[0,0,1],[1,1,1]],color:'orange'},
    O:{shape:[[1,1],[1,1]],color:'yellow'},
    S:{shape:[[0,1,1],[1,1,0]],color:'green'},
    T:{shape:[[0,1,0],[1,1,1]],color:'purple'},
    Z:{shape:[[1,1,0],[0,1,1]],color:'red'}
}
const pieceKeys=Object.keys(pieces);
function getRandomPiece() {
    const randomIndex = Math.floor(Math.random() * pieceKeys.length);
    const pieceKey = pieceKeys[randomIndex];
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
    if (timestamp - lastTime >= dropInterval) {
        move_piece('down');
        lastTime = timestamp;
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);


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
        current_piece.shape = oldShape;
    }
    render();
}
function clear_lines() {
    for (let r = 19; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            
            board.splice(r, 1);
            board.unshift(new Array(10).fill(0));
            r++; 
        }
    }
}