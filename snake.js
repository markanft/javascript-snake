const ROWS = 40;
const COLS = 60;
const PIXEL = 15;

const initialSnakePos = [
    '1-1' ,  
    '2-1',
    '3-1',
    '4-1',
    '5-1',
    '6-1'
]
let snakePos;
let DIR;
let pixels = new Map();
let foodPos;
let prevFoodPos;
let interval = null;
let initialSpeed = 100;
let speed = initialSpeed;
let decreaseTime = 4;

const canvas = document.getElementById("canvas");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
stopButton.addEventListener("click", () => {
    clearInterval(interval);
})

resetButton.addEventListener("click", () => {
    clearInterval(interval);
    startGame();
})

const getNextFood = () => {
    let newFoodPos = getRandomPos(0,COLS-1) + '-' + getRandomPos(0,ROWS-1);
    if (snakePos.some(pos => pos === newFoodPos)) getNextFood();
    return newFoodPos;
}

const startGame = () => {
    snakePos = initialSnakePos.slice();
    speed = initialSpeed;
    DIR = ["RIGHT"];
    foodPos = getNextFood();
    prevFoodPos = '';
    interval = setInterval(() => {
        move();
    }, speed);
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "ArrowLeft":
            if (DIR[DIR.length-1] !== "RIGHT") DIR.push('LEFT');
            break;
        case "ArrowRight":
            if (DIR[DIR.length-1] !== "LEFT") DIR.push('RIGHT');
            break;
        case "ArrowUp":
            if (DIR[DIR.length-1] !== "DOWN") DIR.push('UP');
            break;
        case "ArrowDown":
            if (DIR[DIR.length-1] !== "UP") DIR.push('DOWN');
            break;
    }
});

const renderGrid = () => {
    const div = document.createElement('div');
    canvas.appendChild(div);
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLS; j++) {
            const pixel = document.createElement('div');
            pixel.style.display = 'inline-block';
            pixel.style.border = '1px solid gray';
            pixel.style.width = PIXEL + 'px';
            pixel.style.height = PIXEL + 'px';

            div.appendChild(pixel);
            pixels.set(j+'-'+i, pixel);
        }
    }
}   

const drawSnake = () => {
    for(let i = 0; i < ROWS; i++) {
        for(let j = 0; j < COLS; j++) {
            let position = j+'-'+i;
            let pixel = pixels.get(position)
            pixel.style.background = snakePos.some(pos => pos === position) ? 'black' : 'white';
            if (foodPos === position) pixel.style.background = 'red'; 
        }
    }
}  

function getRandomPos(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const move = () => {
    let [col, row] = snakePos[snakePos.length-1].split("-").map(pos => Number(pos));
    if (DIR[0] === "RIGHT") col = col === COLS - 1 ? 0 : col + 1;
    if (DIR[0] === "DOWN") row = row === ROWS - 1 ? 0 : row + 1;
    if (DIR[0] === "LEFT") col = col === 0 ? COLS - 1 : col - 1;
    if (DIR[0] === "UP") row = row === 0 ? ROWS - 1 : row - 1;

    if (snakePos[0] === prevFoodPos) {
        prevFoodPos = '';
    } else {
        snakePos.shift();
    }
    
    if (snakePos[snakePos.length-1] === foodPos)  {
        prevFoodPos = foodPos;
        foodPos = getNextFood();
        if (snakePos.length % 5 === 0) {
            increaseSpeed();
        }
    }
    if (snakePos.some(pos => pos === `${col}-${row}`)) clearInterval(interval);
    snakePos.push(`${col}-${row}`);
    if (DIR.length > 1) DIR.shift()
    drawSnake();
}

const increaseSpeed = () => {
    clearInterval(interval);
    speed -= decreaseTime;
    interval = setInterval(() => {
        move();
    }, speed)
}



renderGrid();
startGame();