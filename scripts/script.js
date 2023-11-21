let step = true;
let size = 0;
let currPlayer = "X";
let totalMoves = 0;
let timer;
let statistics = '';
let seconds1 = 0;
let minutes1 = 0;
let seconds2 = 0;
let minutes2 = 0;
let lastMoveTime = 0;


let gameTable = document.getElementById('game-table');
gameTable.style.display = "none";
let submitButton = document.getElementById('submit-button');
let exitButton = document.getElementById('restart-button');
exitButton.style.display = "none";
let resback = document.getElementById("result-back");


function createBoard() {
        size = Math.floor(document.getElementById('board-size').value);
        if (size < 2 || size > 8) {
            alert('board size must be 2-8');
        }
        else {
            InitializeGame();
            const parentElement = document.getElementById('game-board');
            parentElement.innerHTML = '';
            parentElement.style = `grid-template-columns: repeat(${size}, 104px)`;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.setAttribute('data-index', String.fromCharCode(65 + j) + (size - i));
                    parentElement.append(cell);
                }
            }

            const cells = document.querySelectorAll('.cell');




            
            for (let i = 0; i < cells.length; ++i) {
                cells[i].addEventListener('click', makeMove);
            }
            startTime();
        }
}

function InitializeGame() {
    resetBoard();
    resetTime();
    submitButton.innerHTML = "Restart";
    gameTable.style.display = "block";
    resback.style.display = 'none';
    exitButton.style.display = "block";
    document.getElementById("Total-playtime").innerHTML =  `Total play time is ${size} minutes!` 
}

function makeMove() {
    const now = performance.now();
    if (now - lastMoveTime < 500) {
        return; 
    }  
    lastMoveTime = now;

    totalMoves++;
    currPlayer = step ? "X" : "O";
    if (this.innerText == '' && step) {   
        document.getElementById('X').style.color = "black";
        document.getElementById('O').style.color = "red";
        step = false;
        makeMovehelper(this, minutes1, seconds1);
    } 
    else if (this.innerText == '' && !step) {
        document.getElementById('X').style.color = "red";
        document.getElementById('O').style.color = "black";
        makeMovehelper(this, minutes2, seconds2);
        step = true;     
    }      
}

function makeMovehelper(cell, minutes, seconds) {
    cell.innerText = currPlayer;          
    let matrix = getMatrix();
    statistics += `${totalMoves}. Player: ${currPlayer} - Cell: ${cell.getAttribute('data-index')} - Time: ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}<br>`;
    if (winCheck(matrix, currPlayer)) {
        clearInterval(timer);
        PrintResult(currPlayer);
    }
    else if (totalMoves == size * size) {
        PrintResult("Draw");
        clearInterval(timer);
    }
}

function getMatrix() {
    const cells = document.querySelectorAll('.cell');
    const matrix = [];
    let k = 0;
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            const val = cells[k++].innerText;
            row.push(val);
        }
        matrix.push(row);
    }
    return matrix;
}

function winCheck(matrix, symbol) {

    //row
    for (let i = 0; i < matrix.length; i++) {
        let rowWin = true;
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] !== symbol) {
                rowWin = false;
                break;
            }
        }
        if (rowWin) {
            return true;
        }
    }

    //col
    for(let i = 0; i < matrix.length; ++i) {
        let colWin = true;
        for (let j = 0; j < matrix.length; ++j) {
            if (matrix[j][i] !== symbol) {
                colWin = false;
                break;
            }
        }
        if (colWin) {
            return true;
        }
    }

    //main diagonal
    let mainWin = true;
    for (let i = 0; i < matrix.length; ++i) {
        if (matrix[i][i] !== symbol) {
            mainWin = false;
            break;
        }
    }
    if (mainWin) {
        return true;
    }

    //auxillary diagonal
    let auxillaryWin = true;
    for (let i = 0; i < matrix.length; ++i) {
        if (matrix[i][matrix.length - i - 1] !== symbol) {
            auxillaryWin = false;
            break;
        }
    }
    if (auxillaryWin) {
        return true;
    }

    
    return false;
};

function PrintResult(checkWord) {
    setTimeout(() => {
        resback.style.display = 'block';
        let res = document.getElementById("result");
        let title = document.getElementById("res-title");
        if (checkWord == "Draw") {
            title.innerHTML = `Draw`;
            res.innerHTML = statistics;
        }
        else {
            title.innerHTML = `Congratultions ${currPlayer} Wins!!!`
            res.innerHTML = statistics;
        }
    }, 700);
} 

function startTime() {
    timer = setInterval(updateTime, 1000);
}

function updateTime() {
    if (step) {
        seconds1++;
        if (seconds1 == 60) {
            seconds1 = 0;
            minutes1++;
        }
        document.getElementById('timer1').innerText = `${String(minutes1).padStart(2, '0')} : ${String(seconds1).padStart(2, '0')}`;
    }
    else {
    seconds2++;
    if (seconds2 == 60) {
        seconds2 = 0;
        minutes2++;
    }
    document.getElementById('timer2').innerText = `${String(minutes2).padStart(2, '0')} : ${String(seconds2).padStart(2, '0')}`;
   }

    let time1 = minutes1 * 60 + seconds1;
    let time2 = minutes2 * 60 + seconds2;
    if (time1 + time2 > size * 60) {
        PrintResult();
        clearInterval(timer);
    }
}

function resetTime() {
    clearInterval(timer);
    seconds1 = 0;
    minutes1 = 0;
    seconds2 = 0;
    minutes2 = 0;
    document.getElementById('timer1').innerText = '00 : 00';
    document.getElementById('timer2').innerText = '00 : 00';
}

function resetBoard() {
        clearInterval(timer);
        resetTime();
        const parentElementBoard = document.getElementById('game-board');
        const cells = document.getElementsByClassName('cell');
        for (let i = cells.length - 1; i >= 0; --i) {
            parentElementBoard.removeChild(cells[i]);
        }
        gameTable.style.display = "none";
        submitButton.innerHTML = "Submit";
        resback.style.display = 'none';
        exitButton.style.display = "none";
        statistics = '';
        currPlayer = "X";
        step = true;
        totalMoves = 0;
        document.getElementById('X').style.color = "red";
        document.getElementById('O').style.color = "black";
}