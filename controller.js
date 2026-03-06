let current_piece = getRandomPiece();

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft')       move_piece('left');
    else if (event.key === 'ArrowRight') move_piece('right');
    else if (event.key === 'ArrowDown')  move_piece('down');
    else if (event.key === ' ')            move_piece('space');
    else if (event.key === 'ArrowUp')    rotate_piece();
});

move_piece = (key_value) => {
    if (key_value === 'left' && !collusion_check(-1, 0)) {
        current_piece.x -= 1;
    }
    if (key_value === 'right' && !collusion_check(1, 0)) {
        current_piece.x += 1;
    }
    if (key_value === 'down') {
        if (!collusion_check(0, 1)) {
            current_piece.y += 1;       
        } else {
            lock_piece();               
            current_piece = getRandomPiece();
        }
    }
    if (key_value === 'space') {
        while (!collusion_check(0, 1)) {
            current_piece.y += 1;       
        }
        lock_piece();
        current_piece = getRandomPiece();
    }
    render();
    clear_lines();
}

document.body.focus();