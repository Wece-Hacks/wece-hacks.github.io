const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pacman = {
    x: 200,
    y: 200,
    radius: 15,
    speed: 2,
    angle: 0.2,
    direction: 'right'
};

const ghosts = [
    { x: 100, y: 100, radius: 15, color: 'red', speed: 1 },
    { x: 300, y: 300, radius: 15, color: 'pink', speed: 1 }
];

const fruits = [
    { x: 150, y: 150, eaten: false },
    { x: 250, y: 250, eaten: false }
];

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
        ghost.x += ghost.speed * (Math.random() < 0.5 ? 1 : -1);
        ghost.y += ghost.speed * (Math.random() < 0.5 ? 1 : -1);
    });
}

function checkFruitCollision() {
    fruits.forEach(fruit => {
        if (!fruit.eaten) {
            const dist = Math.hypot(pacman.x - fruit.x, pacman.y - fruit.y);
            if (dist < pacman.radius) fruit.eaten = true;
        }
    });
}

function checkWinCondition() {
    if (fruits.every(fruit => fruit.eaten)) {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('flag!', canvas.width / 2 - 40, canvas.height / 2);
        return true;
    }
    return false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    drawPacman();
    drawGhosts();
    drawFruits();
    updatePacman();
    updateGhosts();
    checkFruitCollision();
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

gameLoop();
