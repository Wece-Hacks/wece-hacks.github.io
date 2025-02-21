const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pacman = { x: 200, y: 200, radius: 15, speed: 2, angle: 0.2, direction: 'right' };
let ghosts = [];
let fruits = [];
let score = 0;
const maxScore = 7;

function getRandomPosition(radius) {
    let x, y, overlapping;
    do {
        x = Math.random() * (canvas.width - 2 * radius) + radius;
        y = Math.random() * (canvas.height - 2 * radius) + radius;
        overlapping = ghosts.some(ghost => Math.hypot(x - ghost.x, y - ghost.y) < radius * 2) ||
                      fruits.some(fruit => Math.hypot(x - fruit.x, y - fruit.y) < radius * 2);
    } while (overlapping);
    return { x, y };
}

function generateGhosts() {
    ghosts = [
        { ...getRandomPosition(15), radius: 15, color: 'red', speed: 2 },
        { ...getRandomPosition(15), radius: 15, color: 'pink', speed: 2 }
    ];
}

function generateFruits() {
    fruits = Array.from({ length: 5 }, () => ({
        ...getRandomPosition(5),
        eaten: false
    }));
}

function drawPacman() {
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, pacman.angle * Math.PI, (2 - pacman.angle) * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, ghost.radius, 0, 2 * Math.PI);
        ctx.fillStyle = ghost.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawFruits() {
    fruits.forEach(fruit => {
        if (!fruit.eaten) {
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'orange';
            ctx.fill();
            ctx.closePath();
        }
    });
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function updatePacman() {
    switch (pacman.direction) {
        case 'right':
            pacman.x += pacman.speed;
            if (pacman.x + pacman.radius > canvas.width) pacman.x = canvas.width - pacman.radius;
            break;
        case 'left':
            pacman.x -= pacman.speed;
            if (pacman.x - pacman.radius < 0) pacman.x = pacman.radius;
            break;
        case 'up':
            pacman.y -= pacman.speed;
            if (pacman.y - pacman.radius < 0) pacman.y = pacman.radius;
            break;
        case 'down':
            pacman.y += pacman.speed;
            if (pacman.y + pacman.radius > canvas.height) pacman.y = canvas.height - pacman.radius;
            break;
    }
}

function updateGhosts() {
    ghosts.forEach(ghost => {
        ghost.x += ghost.speed * (Math.random() < 0.5 ? 2 : -2);
        ghost.y += ghost.speed * (Math.random() < 0.5 ? 2 : -2);

        if (ghost.x - ghost.radius < 0) ghost.x = ghost.radius;
        if (ghost.x + ghost.radius > canvas.width) ghost.x = canvas.width - ghost.radius;
        if (ghost.y - ghost.radius < 0) ghost.y = ghost.radius;
        if (ghost.y + ghost.radius > canvas.height) ghost.y = canvas.height - ghost.radius;
    });
}

function checkCollisions() {
    for (let ghost of ghosts) {
        if (Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y) < pacman.radius + ghost.radius) {
            score = 0;
            resetGame();
            return;
        }
    }
    fruits.forEach(fruit => {
        if (!fruit.eaten && Math.hypot(pacman.x - fruit.x, pacman.y - fruit.y) < pacman.radius) {
            fruit.eaten = true;
        }
    });
}

function checkWinCondition() {
    if (fruits.every(fruit => fruit.eaten)) {
        score++;
        if (score >= maxScore) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText('flag!', canvas.width / 2 - 40, canvas.height / 2);
            return true;
        } else {
            resetGame();
        }
    }
    return false;
}

function resetGame() {
    pacman.x = 200;
    pacman.y = 200;
    pacman.direction = 'right';
    generateGhosts();
    generateFruits();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    drawPacman();
    drawGhosts();
    drawFruits();
    drawScore();
    updatePacman();
    updateGhosts();
    checkCollisions();
    if (!checkWinCondition()) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            pacman.direction = 'right';
            break;
        case 'ArrowLeft':
            pacman.direction = 'left';
            break;
        case 'ArrowUp':
            pacman.direction = 'up';
            break;
        case 'ArrowDown':
            pacman.direction = 'down';
            break;
    }
});

generateGhosts();
generateFruits();
gameLoop();
