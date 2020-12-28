// TCSS 435 - Tic Tac Toe
// Dr.Marriott
// Author: Chinh Le
// StudentID: 1841162

var Agent = function () {

}

Agent.prototype.selectMove = function(board) {
    var freeCells = [];
    let highestScore;
    let move;
    if(board.playerOne) {
        highestScore = -Infinity;
    } else {
        highestScore = Infinity;
    }    
    for (var i = 1; i < 10; i++) {
        if (board.cellFree(i)) {
            freeCells.push(i);
        }
    }
    // console.log("current free cells: " + freeCells);
    for (var i = 0; i < freeCells.length; i++) {
        // debugger;
        let cloneBoard = board.clone();
        cloneBoard.move(freeCells[i]);  
        let score = minimax(cloneBoard, 0, cloneBoard.playerOne);
        if (!cloneBoard.playerOne) {
            if (score > highestScore) {
                highestScore = score;
                move = freeCells[i];
            }
        } else {
            if (score < highestScore) {
                highestScore = score;
                move = freeCells[i];
            }
        }
    }
    return move;
}

function minimax(board, depth, isPlayerOne) {
    let result = board.gameOver();

    if (result !== 0) {
        if (result === 1) {
            return 1;
        }
        if (result === 2) {
            return -1;
        }
        if (result === 3) {
            return 0;
        }
    }
    if (isPlayerOne) {
        let highestScore = -Infinity;
        for (var i = 1; i < 10; i++) {
            if(board.cellFree(i)) {
                let cloneBoard = board.clone();
                cloneBoard.move(i);
                let score = minimax(cloneBoard, depth + 1, cloneBoard.playerOne);
                if (score > highestScore) {
                    highestScore = score;
                }
                
            }
        }
        return highestScore;
    } else {
        let highestScore = +Infinity;
        for (var i = 1; i < 10; i++) {
            if(board.cellFree(i)) {
                let cloneBoard = board.clone();
                cloneBoard.move(i);
                let score = minimax(cloneBoard, depth + 1, cloneBoard.playerOne);
                if (score < highestScore) {
                    highestScore = score;
                }

            }
        }
        return highestScore;
    }
}