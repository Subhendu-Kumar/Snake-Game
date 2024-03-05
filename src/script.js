//game constants and variables
let direction = { x: 0, y: 0 };
const foodSound = new Audio("./sound/food.mp3");
const gameoverSound = new Audio("./sound/gameover.mp3");
const moveSound = new Audio("./sound/move.mp3");
const board = document.querySelector(".game-board");
const Score = document.querySelector(".Score");
const Hi_Score = document.querySelector(".Hi-Score");
let speed = 8;
let lastPaintTime = 0;
let snakeArray = [{ x: 15, y: 14 }];
let food = { x: 5, y: 10 };
let score = 0;
let hi_Score = 0;

// keyboard action listiner
window.addEventListener("keydown", (e) => {
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      direction.x = 0;
      direction.y = -1;
      break;
    case "ArrowDown":
      direction.x = 0;
      direction.y = 1;
      break;
    case "ArrowLeft":
      direction.x = -1;
      direction.y = 0;
      break;
    case "ArrowRight":
      direction.x = 1;
      direction.y = 0;
      break;
  }
});

//game Functionds
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  snakeGame();
}

function isCollide(snake) {
  // if snake bumb by own
  for (let i = 1; i < snakeArray.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }
  if (
    snake[0].x >= 20 ||
    snake[0].x <= 0 ||
    snake[0].y >= 20 ||
    snake[0].y <= 0
  ) {
    return true;
  }
  return false;
}

function snakeGame() {
  // updating snakeArray and food
  if (isCollide(snakeArray)) {
    gameoverSound.play();
    direction = { x: 0, y: 0 };
    alert("game over!  press ok to play new game");
    snakeArray = [{ x: 15, y: 14 }];
    food = { x: 5, y: 10 };
    score = 0;
    Score.innerText = `Score : ${score}`;
  }

  // regenerate the food after eaten
  if (snakeArray[0].x === food.x && snakeArray[0].y === food.y) {
    foodSound.play();
    snakeArray.unshift({
      x: snakeArray[0].x + direction.x,
      y: snakeArray[0].y + direction.y,
    });
    score++;
    hi_Score++;
    Score.innerText = `Score : ${score}`;
    Hi_Score.innerText = `Hi-Score : ${hi_Score}`;

    food = {
      x: Math.floor(Math.random() * 13) + 3,
      y: Math.floor(Math.random() * 13) + 3,
    };
  }

  // moving the snake
  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }
  snakeArray[0].x += direction.x;
  snakeArray[0].y += direction.y;

  //display the snake
  board.innerHTML = "";
  snakeArray.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("snake-head");
    } else {
      snakeElement.classList.add("snake-body");
    }
    board.appendChild(snakeElement);
  });

  //display the food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

window.requestAnimationFrame(main);


// Function to handle touch events
function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  e.preventDefault(); // Prevent scrolling on touch devices
  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Adjust sensitivity based on your needs
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    direction.x = deltaX > 0 ? 1 : -1;
    direction.y = 0;
  } else {
    // Vertical swipe
    direction.x = 0;
    direction.y = deltaY > 0 ? 1 : -1;
  }
}

// Add touch event listeners
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchmove", handleTouchMove);
