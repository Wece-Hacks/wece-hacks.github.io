// ===== EDIT YOUR CONNECTIONS HERE =====
const puzzles = [
    [
        {
            name: "SIGNAL PROCESSING",
            words: ["LINEAR", "TIME-INVARIANT", "IMPULSE", "CONVOLUTION"]
        },
        {
            name: "FPGA",
            words: ["LUT", "BITSTREAM", "SYNTHESIS", "TIMING"]
        },
        {
            name: "LAPLACE",
            words: ["ROC", "TRANSFORM", "S-DOMAIN", "POLES"]
        },
        {
            name: "DIGITAL LOGIC",
            words: ["LATCH", "FLIPFLOP", "REGISTER", "COUNTER"]
        }
    ],
    [
        {
            name: "CIRCUIT ELEMENTS",
            words: ["RESISTOR", "CAPACITOR", "INDUCTOR", "DIODE"]
        },
        {
            name: "BOOLEAN OPERATORS",
            words: ["AND", "OR", "NOT", "XOR"]
        },
        {
            name: "MODULATION TYPES",
            words: ["AM", "FM", "QAM", "PSK"]
        },
        {
            name: "MICROCONTROLLER PINS",
            words: ["GND", "VCC", "RX", "TX"]
        }
    ]
];
// =======================================

let currentPuzzle = 0;
let selected = [];
let solvedGroups = 0;
let groups = puzzles[currentPuzzle];

const board = document.getElementById("board");
const message = document.getElementById("message");

function initializePuzzle() {
    // Clear board and reset state
    board.innerHTML = "";
    selected = [];
    solvedGroups = 0;
    message.innerText = "";
    groups = puzzles[currentPuzzle];

    // Flatten words
    let allWords = groups.flatMap(g => g.words);

    // Shuffle words
    allWords.sort(() => Math.random() - 0.5);

    // Create tiles
    allWords.forEach(word => {
        const div = document.createElement("div");
        div.classList.add("tile");
        div.innerText = word;
        div.onclick = () => toggleSelect(div);
        board.appendChild(div);
    });
}

// Initialize first puzzle
initializePuzzle();

function toggleSelect(tile) {
    if (tile.classList.contains("solved")) return;

    if (tile.classList.contains("selected")) {
        tile.classList.remove("selected");
        selected = selected.filter(w => w !== tile.innerText);
    } else {
        if (selected.length < 4) {
            tile.classList.add("selected");
            selected.push(tile.innerText);
        }
    }
}

function clearSelection() {
    document.querySelectorAll(".tile.selected")
        .forEach(t => t.classList.remove("selected"));
    selected = [];
    message.innerText = "";
}

function submitGuess() {
    if (selected.length !== 4) {
        message.innerText = "Select exactly 4 words.";
        return;
    }

    for (let group of groups) {
        if (arraysEqual(selected.sort(), group.words.slice().sort())) {
            markSolved(group.words);
            solvedGroups++;
            message.innerText = `Correct! Category: ${group.name}`;
            selected = [];

            if (solvedGroups === 4) {
                if (currentPuzzle === 0) {
                    // Puzzle 1 complete, move to puzzle 2
                    message.innerText = "🎉 Puzzle 1 complete! Get ready for puzzle 2...";
                    currentPuzzle = 1;
                    setTimeout(() => {
                        initializePuzzle();
                    }, 2000);
                } else {
                    // Both puzzles complete
                    message.innerText = "🎉🎉 You solved all connections! wecehacksctf{You're_so_smart!} 🎉🎉\n";
                }
            }

            return;
        }
    }

    message.innerText = "Incorrect group. Try again!";
}

function markSolved(words) {
    document.querySelectorAll(".tile").forEach(tile => {
        if (words.includes(tile.innerText)) {
            tile.classList.remove("selected");
            tile.classList.add("solved");
        }
    });
}

function arraysEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
