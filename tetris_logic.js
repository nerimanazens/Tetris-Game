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

