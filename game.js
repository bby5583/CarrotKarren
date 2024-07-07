const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const retryButton = document.getElementById('retryButton');

const snakeHeadImages = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image()
];
snakeHeadImages[0].src = 'snake_head1.png'; // 길이 1~5
snakeHeadImages[1].src = 'snake_head2.png'; // 길이 6~10
snakeHeadImages[2].src = 'snake_head3.png'; // 길이 11~14
snakeHeadImages[3].src = 'snake_head4.png'; // 길이 15~19
snakeHeadImages[4].src = 'snake_head5.png'; // 길이 20 이상

const snakeBodyImage = new Image();
snakeBodyImage.src = 'snake_body.png'; // 몸체 이미지 경로 설정
const foodImage = new Image();
foodImage.src = 'food.png'; // 먹이 이미지 경로 설정
const backgroundImage = new Image();
backgroundImage.src = 'background.png'; // 배경 이미지 경로 설정

const backgroundMusic = new Audio('background_music.mp3'); // 배경 음악
const startSound = new Audio('start_sound.mp3'); // 게임 시작 효과음
const eatSound = new Audio('eat_sound.mp3'); // 먹이 먹기 효과음
const gameOverSound = new Audio('game_over_sound.mp3'); // 게임오버 효과음

const snake = [{ x: 180, y: 180 }];
let direction = { x: 0, y: 0 };
let food = { x: 360, y: 360 };
let score = 0;
let gameInterval;
let startTime;
const initialSpeed = 200; // 초기 이동 속도 (ms)
const scoreIncrement = 10; // 먹이 점수 증가량
const gridSize = 30; // 그리드 크기

function startGame() {
    direction = { x: 0, y: 0 };
    snake.length = 1;
    snake[0] = { x: 180, y: 180 };
    placeFood();
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none';
    startScreen.style.display = 'none';
    startTime = Date.now();
    setSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, initialSpeed);
    backgroundMusic.loop = true;
    backgroundMusic.play();
    startSound.play();
}

function gameLoop() {
    if (direction.x !== 0 || direction.y !== 0) {
        moveSnake();
        if (checkCollision()) {
            endGame();
            return;
        }
        if (checkFoodCollision()) {
            eatFood();
        }
        score += Math.floor(snake.length / 2); // 시간에 따른 점수 증가
        scoreDisplay.textContent = `Score: ${score}`;
    }
    drawGame();
}

function setSpeed() {
    clearInterval(gameInterval);
    const speed = initialSpeed / (1 + (snake.length / 10 * 0.5)); // 꼬리 길이에 따라 속도 증가
    gameInterval = setInterval(gameLoop, speed);
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function checkFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function eatFood() {
    const tail = { ...snake[snake.length - 1] };
    snake.push(tail);
    placeFood();
    score += scoreIncrement;
    eatSound.play();
    setSpeed(); // 먹이를 먹을 때마다 속도 설정
}

function drawGame() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        let headImage;
        if (i === 0) {
            if (snake.length <= 5) {
                headImage = snakeHeadImages[0];
            } else if (snake.length <= 10) {
                headImage = snakeHeadImages[1];
            } else if (snake.length <= 14) {
                headImage = snakeHeadImages[2];
            } else if (snake.length <= 19) {
                headImage = snakeHeadImages[3];
            } else {
                headImage = snakeHeadImages[4];
            }
            ctx.drawImage(headImage, segment.x, segment.y, gridSize, gridSize);
        } else {
            ctx.drawImage(snakeBodyImage, segment.x, segment.y, gridSize, gridSize);
        }
    }
    ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);
}

function endGame() {
    clearInterval(gameInterval);
    backgroundMusic.pause();
    gameOverSound.play();
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    finalScoreDisplay.textContent = `Game Over\nTime: ${timeElapsed} seconds\nScore: ${score}`;
    gameOverDisplay.style.display = 'block';
}

function handleStartGame() {
    if (!gameInterval) startGame();
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
    handleStartGame(); // 게임이 시작되지 않은 경우 시작
});

canvas.addEventListener('click', handleStartGame);

retryButton.addEventListener('click', startGame);
