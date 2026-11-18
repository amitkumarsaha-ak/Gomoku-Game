const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const size = 8;
const cell = canvas.width / size;

const HUMAN = "black";      // Blue
const COMPUTER = "white";   // Pink

let board = Array.from({ length: size }, () => Array(size).fill(null));
let currentPlayer = HUMAN;
let gameOver = false;
let started = false;
let isComputerThinking = false;
let computerTimeout = null;

let hoverX = null;
let hoverY = null;
let animatingCell = null;

let blackWin = 0;
let whiteWin = 0;

// Responsive coordinate calculation
function getBoardCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    if (clientX === undefined || clientY === undefined) return null;

    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;

    const x = Math.floor(canvasX / cell);
    const y = Math.floor(canvasY / cell);

    if (x < 0 || x >= size || y < 0 || y >= size) return null;
    return { x, y };
}

// Sound playback with safe fallback
function playSound(file, volume = 0.5) {
    const audio = new Audio("sounds/" + file);
    audio.volume = volume;
    const promise = audio.play();
    if (promise !== undefined) {
        promise.catch(() => {
            const fallback = new Audio(file);
            fallback.volume = volume;
            fallback.play().catch(() => {});
        });
    }
}

drawGrid();

// Human Move Event
function handleHumanMove(e) {
    if (gameOver || !started || isComputerThinking || currentPlayer !== HUMAN) return;

    const coords = getBoardCoordinates(e);
    if (!coords) return;

    const { x, y } = coords;
    if (board[x][y]) return;

    // Place Human Piece
    board[x][y] = HUMAN;
    playSound("click.mp3", 0.4);
    animatePiece(x, y, HUMAN);

    // Check Human Win
    if (checkWin(x, y, HUMAN)) {
        gameOver = true;
        playSound("win.mp3", 0.6);
        blackWin++;
        document.getElementById("blackScore").innerText = blackWin;
        document.getElementById("resultText").innerText = "🎉 Congratulations! You (BLUE) Won!";
        return;
    }

    // Check Draw
    if (isBoardFull()) {
        gameOver = true;
        document.getElementById("resultText").innerText = "🤝 It's a Draw!";
        return;
    }

    // Switch to Computer Turn
    currentPlayer = COMPUTER;
    isComputerThinking = true;
    hoverX = null;
    hoverY = null;
    document.getElementById("resultText").innerText = "🤖 Computer is thinking...";
    redraw();

    // Trigger Computer Move after realistic delay
    computerTimeout = setTimeout(() => {
        if (gameOver || !started) {
            isComputerThinking = false;
            return;
        }
        makeComputerMove();
    }, 450);
}

canvas.addEventListener("click", handleHumanMove);

// Computer Move Logic
function makeComputerMove() {
    const bestMove = getBestComputerMove();
    if (!bestMove) return;

    const { x, y } = bestMove;
    board[x][y] = COMPUTER;
    playSound("click.mp3", 0.4);
    animatePiece(x, y, COMPUTER);

    // Check Computer Win
    if (checkWin(x, y, COMPUTER)) {
        gameOver = true;
        isComputerThinking = false;
        playSound("win.mp3", 0.6);
        whiteWin++;
        document.getElementById("whiteScore").innerText = whiteWin;
        document.getElementById("resultText").innerText = "💻 Computer (PINK) Won!";
        return;
    }

    // Check Draw
    if (isBoardFull()) {
        gameOver = true;
        isComputerThinking = false;
        document.getElementById("resultText").innerText = "🤝 It's a Draw!";
        return;
    }

    // Switch back to Human Turn
    currentPlayer = HUMAN;
    isComputerThinking = false;
    document.getElementById("resultText").innerText = "🔵 Your Turn (BLUE)";
    redraw();
}

// Hover effects (active only on devices with pointer hover support)
canvas.addEventListener("mousemove", function (e) {
    if (gameOver || !started || isComputerThinking || currentPlayer !== HUMAN ||
        (window.matchMedia && !window.matchMedia("(hover: hover)").matches)) {
        if (hoverX !== null || hoverY !== null) {
            hoverX = null;
            hoverY = null;
            redraw();
        }
        return;
    }

    const coords = getBoardCoordinates(e);
    if (coords) {
        if (hoverX !== coords.x || hoverY !== coords.y) {
            hoverX = coords.x;
            hoverY = coords.y;
            redraw();
        }
    } else {
        if (hoverX !== null || hoverY !== null) {
            hoverX = null;
            hoverY = null;
            redraw();
        }
    }
});

canvas.addEventListener("mouseleave", () => {
    hoverX = null;
    hoverY = null;
    redraw();
});

canvas.addEventListener("touchend", () => {
    hoverX = null;
    hoverY = null;
    redraw();
});

// Control Buttons
document.getElementById("startBtn").addEventListener("click", () => {
    if (computerTimeout) clearTimeout(computerTimeout);
    isComputerThinking = false;

    playSound("start.mp3", 0.5);

    started = true;
    gameOver = false;
    board = Array.from({ length: size }, () => Array(size).fill(null));
    currentPlayer = HUMAN;

    document.getElementById("resultText").innerText = "Game Started! Your Turn (BLUE)";
    redraw();
});

document.getElementById("restartBtn").addEventListener("click", () => {
    if (computerTimeout) clearTimeout(computerTimeout);
    isComputerThinking = false;

    playSound("restart.mp3", 0.5);

    board = Array.from({ length: size }, () => Array(size).fill(null));
    gameOver = false;
    started = false;
    currentPlayer = HUMAN;

    document.getElementById("resultText").innerText = "Game Restarted. Press Start Game";
    redraw();
});

// Drawing Helpers
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= size; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(canvas.width, i * cell);
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, canvas.height);
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function redraw() {
    drawGrid();

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y]) {
                if (animatingCell && animatingCell.x === x && animatingCell.y === y) {
                    drawPiece(x, y, board[x][y], animatingCell.r);
                } else {
                    drawPiece(x, y, board[x][y]);
                }
            }
        }
    }

    if (!gameOver && started && !isComputerThinking && currentPlayer === HUMAN &&
        hoverX !== null && hoverY !== null && !board[hoverX]?.[hoverY]) {
        drawGhost(hoverX, hoverY, HUMAN);
    }
}

function getPlayerColor(player) {
    return player === HUMAN ? "#0ea5e9" : "#f43f5e";
}

function drawPiece(x, y, color, customRadius = null) {
    const centerX = x * cell + cell / 2;
    const centerY = y * cell + cell / 2;
    const radius = customRadius !== null ? customRadius : (cell / 2 - 8);

    if (radius <= 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

    ctx.fillStyle = getPlayerColor(color);
    ctx.shadowBlur = 16;
    ctx.shadowColor = getPlayerColor(color);
    ctx.fill();
    ctx.restore();
}

function animatePiece(x, y, color) {
    const maxR = cell / 2 - 8;
    animatingCell = { x, y, color, r: 2 };

    function grow() {
        if (!animatingCell || animatingCell.x !== x || animatingCell.y !== y) return;

        animatingCell.r += 2.5;
        if (animatingCell.r < maxR) {
            redraw();
            requestAnimationFrame(grow);
        } else {
            animatingCell = null;
            redraw();
        }
    }

    grow();
}

function drawGhost(x, y, color) {
    const centerX = x * cell + cell / 2;
    const centerY = y * cell + cell / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, cell / 4, 0, Math.PI * 2);
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = getPlayerColor(color);
    ctx.fill();
    ctx.restore();
}

// Game Rules
function checkWin(x, y, player) {
    const dir = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (let [dx, dy] of dir) {
        let count = 1;

        for (let i = 1; i < 5; i++) {
            if (board[x + i * dx]?.[y + i * dy] === player) count++;
            else break;
        }

        for (let i = 1; i < 5; i++) {
            if (board[x - i * dx]?.[y - i * dy] === player) count++;
            else break;
        }

        if (count >= 5) return true;
    }
    return false;
}

function isBoardFull() {
    return board.every(row => row.every(c => c !== null));
}

// AI Evaluation
function getMoveScoreForPlayer(x, y, player) {
    const dir = [[1, 0], [0, 1], [1, 1], [1, -1]];
    let totalScore = 0;
    let counts = { win: 0, open4: 0, blocked4: 0, open3: 0, blocked3: 0, open2: 0 };

    for (let [dx, dy] of dir) {
        let cPos = 0;
        let step = 1;
        while (board[x + step * dx]?.[y + step * dy] === player) {
            cPos++;
            step++;
        }
        let posOpen = (x + step * dx >= 0 && x + step * dx < size &&
                       y + step * dy >= 0 && y + step * dy < size &&
                       board[x + step * dx][y + step * dy] === null);

        let cNeg = 0;
        step = 1;
        while (board[x - step * dx]?.[y - step * dy] === player) {
            cNeg++;
            step++;
        }
        let negOpen = (x - step * dx >= 0 && x - step * dx < size &&
                       y - step * dy >= 0 && y - step * dy < size &&
                       board[x - step * dx][y - step * dy] === null);

        let count = 1 + cPos + cNeg;
        let openEnds = (posOpen ? 1 : 0) + (negOpen ? 1 : 0);

        // Check if forming 5 in this direction is possible
        let spacePos = cPos;
        step = cPos + 1;
        while (board[x + step * dx]?.[y + step * dy] === null) {
            spacePos++;
            step++;
        }
        let spaceNeg = cNeg;
        step = cNeg + 1;
        while (board[x - step * dx]?.[y - step * dy] === null) {
            spaceNeg++;
            step++;
        }
        let totalPossible = 1 + spacePos + spaceNeg;

        if (totalPossible < 5 && count < 5) {
            continue;
        }

        if (count >= 5) {
            counts.win++;
            totalScore += 100000;
        } else if (count === 4) {
            if (openEnds === 2) {
                counts.open4++;
                totalScore += 10000;
            } else if (openEnds === 1) {
                counts.blocked4++;
                totalScore += 2500;
            }
        } else if (count === 3) {
            if (openEnds === 2) {
                counts.open3++;
                totalScore += 3000;
            } else if (openEnds === 1) {
                counts.blocked3++;
                totalScore += 300;
            }
        } else if (count === 2) {
            if (openEnds === 2) {
                counts.open2++;
                totalScore += 150;
            } else if (openEnds === 1) {
                totalScore += 20;
            }
        } else if (count === 1) {
            if (openEnds === 2) {
                totalScore += 5;
            }
        }
    }

    return { totalScore, counts };
}

function evaluateCandidate(x, y) {
    const ai = getMoveScoreForPlayer(x, y, COMPUTER);
    const human = getMoveScoreForPlayer(x, y, HUMAN);

    // 1. Computer can win immediately
    if (ai.counts.win > 0) return 1000000;

    // 2. Human can win on next turn -> MUST block immediately
    if (human.counts.win > 0) return 800000;

    // 3. Computer can create Open 4 or multi-four threat
    if (ai.counts.open4 > 0 || ai.counts.blocked4 >= 2 || (ai.counts.blocked4 >= 1 && ai.counts.open3 >= 1)) {
        return 500000;
    }

    // 4. Human can create Open 4 or lethal multi-threat -> MUST block
    if (human.counts.open4 > 0 || human.counts.blocked4 >= 2 || (human.counts.blocked4 >= 1 && human.counts.open3 >= 1)) {
        return 400000;
    }

    // 5. Computer can create double Open 3
    if (ai.counts.open3 >= 2) return 200000;

    // 6. Human can create double Open 3 -> Block
    if (human.counts.open3 >= 2) return 150000;

    // Positional evaluation combining attack and defense
    let score = ai.totalScore * 1.2 + human.totalScore * 1.0;

    // Center proximity bonus (center is 3.5 on 8x8 grid)
    const centerDist = Math.abs(x - 3.5) + Math.abs(y - 3.5);
    score += (7 - centerDist) * 2;

    // Random jitter so identical scores don't play identically every game
    score += Math.random() * 2;

    return score;
}

function getBestComputerMove() {
    let bestScore = -Infinity;
    let bestMoves = [];

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] === null) {
                const score = evaluateCandidate(x, y);
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [{ x, y }];
                } else if (Math.abs(score - bestScore) < 0.001) {
                    bestMoves.push({ x, y });
                }
            }
        }
    }

    if (bestMoves.length === 0) return null;
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
