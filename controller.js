let current_piece = spawnNextPiece();

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (!gameStarted) return;

        if (isCountingDown) return;

        if (!isPaused) {
            isPaused = true;
            game_sounds.music.pause();
        } else {
            startCountdown(() => {
                isPaused = false;
                lastTime = performance.now();
                game_sounds.music.play();
            });
        }

        render();
        return;
    }
    if (isPaused || isCountingDown) return;
    if (event.key === 'ArrowLeft') move_piece('left');
    else if (event.key === 'ArrowRight') move_piece('right');
    else if (event.key === 'ArrowDown') {
        score += 1;
        document.getElementById('score').textContent = score;
        move_piece('down');
    }
    else if (event.key === ' ') move_piece('space');
    else if (event.key === 'ArrowUp') rotate_piece();
    else if (event.key === 'Shift' || event.key === 'c' || event.key === 'C') hold();
});

const move_piece = (key_value) => {
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
            current_piece = spawnNextPiece();
            if (collusion_check(0, 0)) { game_over(); return; }
        }
    }
    if (key_value === 'space') {
        while (!collusion_check(0, 1)) {
            current_piece.y += 1;
        }
        lock_piece();
        current_piece = spawnNextPiece();
        if (collusion_check(0, 0)) { game_over(); return; }
    }
    render();
    clear_lines();
}

document.body.focus();