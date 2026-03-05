let current_piece = getRandomPiece();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft')       move_piece('left');
    else if (event.key === 'ArrowRight') move_piece('right');
    else if (event.key === 'ArrowDown')  move_piece('down');
    else if (event.key === 'ArrowUp')    move_piece('up');
    else if (event.key === 'Enter'){
        lock_piece();
        current_piece = getRandomPiece();
        render();
    }
});

move_piece = (key_value) => {
    if (key_value === 'left' && current_piece.x > 0) {current_piece.x -= 1;}
    if (key_value === 'right' && current_piece.x < 10 - current_piece.shape[0].length) {current_piece.x += 1;}
    else if (key_value === 'down' && current_piece.y < 20 - current_piece.shape.length) {current_piece.y += 1;}
    
    render();
}

document.body.focus();