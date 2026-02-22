let currentRound = 1;
let maxRounds = 2;

let solution = "";
let currentRow = 0;
let currentCol = 0;
let guesses = Array.from({ length: 6 }, () => Array(6).fill(""));

const board = document.getElementById("board");
const message = document.getElementById("message");
const roundDisplay = document.getElementById("round-display");

function getSolutionWord(round) {
    if (round === 1) return "BINARY";
    if (round === 2) return "AMPERE";
    return "DIODE";
}


function createBoard() {
    board.innerHTML = "";
    for (let r = 0; r < 6; r++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for (let c = 0; c < 6; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("data-row", r);
            tile.setAttribute("data-col", c);
            row.appendChild(tile);
        }

        board.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";

    for (let char of keys) {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = char;
        key.addEventListener("click", () => handleInput(char));
        keyboard.appendChild(key);
    }

    const enter = document.createElement("div");
    enter.classList.add("key");
    enter.textContent = "ENTER";
    enter.addEventListener("click", handleEnter);
    keyboard.appendChild(enter);

    const backspace = document.createElement("div");
    backspace.classList.add("key");
    backspace.textContent = "⌫";
    backspace.addEventListener("click", handleBackspace);
    keyboard.appendChild(backspace);
}

function handleInput(letter) {
    if (currentCol < 6 && currentRow < 6) {
        guesses[currentRow][currentCol] = letter;
        updateTile(currentRow, currentCol, letter);
        currentCol++;
    }
}

function handleBackspace() {
    if (currentCol > 0) {
        currentCol--;
        guesses[currentRow][currentCol] = "";
        updateTile(currentRow, currentCol, "");
    }
}

function handleEnter() {
    if (currentCol < 6) {
        message.textContent = "Not enough letters!";
        return;
    }

    const guessWord = guesses[currentRow].join("");

    for (let c = 0; c < 6; c++) {
        const tile = getTile(currentRow, c);
        const letter = guessWord[c];

        if (solution[c] === letter) {
            tile.classList.add("correct");
        } else if (solution.includes(letter)) {
            tile.classList.add("present");
        } else {
            tile.classList.add("absent");
        }
    }

    if (guessWord === solution) {
        if (currentRound === maxRounds) {
            message.textContent = "🎉 Congratulations! You beat both rounds! wecehacksctf{six_seven}";
            disableGame();
        } else {
            currentRound++;
            roundDisplay.textContent = `Round ${currentRound} of 2`;
            message.textContent = "Nice! Get ready for Round 2!";
            resetRound();
        }
        return;
    }

    currentRow++;
    currentCol = 0;

    if (currentRow === 6) {
        message.textContent = `Refresh to try again!`;
        disableGame();
    }
}

function updateTile(row, col, letter) {
    const tile = getTile(row, col);
    tile.textContent = letter;
}

function getTile(row, col) {
    return document.querySelector(
        `.tile[data-row='${row}'][data-col='${col}']`
    );
}

function resetRound() {
    solution = getSolutionWord(currentRound);
    currentRow = 0;
    currentCol = 0;
    guesses = Array.from({ length: 6 }, () => Array(6).fill(""));
    setTimeout(createBoard, 1000);
}

function disableGame() {
    document.querySelectorAll(".key").forEach(key => {
        key.style.pointerEvents = "none";
        key.style.opacity = "0.5";
    });
}

solution = getSolutionWord(currentRound);
createBoard();
createKeyboard();

document.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
        handleInput(letter);
    } else if (e.key === "Enter") {
        handleEnter();
    } else if (e.key === "Backspace") {
        handleBackspace();
    }
});