const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const size = 8;
const cell = canvas.width / size;

let board = Array.from({length:size},()=>Array(size).fill(null));
let currentPlayer = "black";
let gameOver = false;
let started = false;

let hoverX = null;
let hoverY = null;

let blackWin = 0;
let whiteWin = 0;

const clickSound = new Audio("sounds/click.mp3");
const winSound   = new Audio("sounds/win.mp3");
const startSound = new Audio("sounds/start.mp3");

clickSound.volume = 0.4;
winSound.volume   = 0.6;
startSound.volume = 0.5;

drawGrid();

canvas.addEventListener("click", function(e){

    if(gameOver || !started) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left)/cell);
    const y = Math.floor((e.clientY - rect.top)/cell);

    if(board[x][y]) return;

    board[x][y] = currentPlayer;

    clickSound.currentTime = 0;
    clickSound.play();

    animatePiece(x,y,currentPlayer);

    if(checkWin(x,y,currentPlayer)){

        gameOver = true;

        winSound.currentTime = 0;
        winSound.play();

        if(currentPlayer==="black"){
            blackWin++;
            document.getElementById("blackScore").innerText = blackWin;
        }else{
            whiteWin++;
            document.getElementById("whiteScore").innerText = whiteWin;
        }

        const playerName = currentPlayer==="black" ? "BLUE" : "PINK";
        document.getElementById("resultText").innerText =
            "🎉 Congratulations " + playerName + " Player!";
        return;
    }

    currentPlayer = currentPlayer === "black" ? "white" : "black";

    const playerName = currentPlayer==="black" ? "BLUE" : "PINK";
    document.getElementById("resultText").innerText =
        playerName + " Turn";
});

canvas.addEventListener("mousemove", function(e){

    const rect = canvas.getBoundingClientRect();
    hoverX = Math.floor((e.clientX - rect.left)/cell);
    hoverY = Math.floor((e.clientY - rect.top)/cell);

    redraw();
});

canvas.addEventListener("mouseleave", ()=>{
    hoverX = null;
    hoverY = null;
    redraw();
});

document.getElementById("startBtn").addEventListener("click", ()=>{

    startSound.currentTime = 0;
    startSound.play();

    started = true;
    gameOver = false;
    board = Array.from({length:size},()=>Array(size).fill(null));

    currentPlayer="black";

    document.getElementById("resultText").innerText =
        "Game Started! BLUE Turn";

    redraw();
});

document.getElementById("restartBtn").addEventListener("click", ()=>{

    startSound.currentTime = 0;
    startSound.play();

    board = Array.from({length:size},()=>Array(size).fill(null));
    gameOver=false;
    started=false;

    document.getElementById("resultText").innerText =
        "Game Restarted. Press Start Game";

    redraw();
});

function drawGrid(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<=size;i++){

        ctx.beginPath();
        ctx.moveTo(0, i*cell);
        ctx.lineTo(canvas.width, i*cell);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i*cell, 0);
        ctx.lineTo(i*cell, canvas.height);
        ctx.stroke();
    }
}

function redraw(){

    drawGrid();

    for(let x=0;x<size;x++){
        for(let y=0;y<size;y++){
            if(board[x][y]){
                drawPiece(x,y,board[x][y]);
            }
        }
    }

    if(!gameOver && started && hoverX!==null && !board[hoverX]?.[hoverY]){
        drawGhost(hoverX,hoverY,currentPlayer);
    }
}

function getPlayerColor(player){
    return player==="black" ? "#0ea5e9" : "#f43f5e";
}

function drawPiece(x,y,color){

    const centerX = x*cell + cell/2;
    const centerY = y*cell + cell/2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, cell/2-8, 0, Math.PI*2);

    ctx.fillStyle = getPlayerColor(color);

    ctx.shadowBlur=16;
    ctx.shadowColor=getPlayerColor(color);
    ctx.fill();
    ctx.shadowBlur=0;
}

function animatePiece(x,y,color){

    let r=0;
    const maxR = cell/2-14;

    function grow(){

        redraw();

        const centerX = x*cell + cell/2;
        const centerY = y*cell + cell/2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI*2);

        ctx.fillStyle = getPlayerColor(color);
        ctx.fill();

        r+=2;
        if(r<=maxR) requestAnimationFrame(grow);
        else redraw();
    }

    grow();
}

function drawGhost(x,y,color){

    const centerX = x*cell + cell/2;
    const centerY = y*cell + cell/2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, cell/4, 0, Math.PI*2);

    ctx.globalAlpha=0.35;
    ctx.fillStyle=getPlayerColor(color);
    ctx.fill();
    ctx.globalAlpha=1;
}

function checkWin(x,y,player){

    const dir=[[1,0],[0,1],[1,1],[1,-1]];

    for(let [dx,dy] of dir){

        let count=1;

        for(let i=1;i<5;i++){
            if(board[x+i*dx]?.[y+i*dy]===player) count++;
            else break;
        }

        for(let i=1;i<5;i++){
            if(board[x-i*dx]?.[y-i*dy]===player) count++;
            else break;
        }

        if(count>=5) return true;
    }
    return false;
}