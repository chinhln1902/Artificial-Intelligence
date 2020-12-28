// Tic Tac Toe
var GameBoard = function () {
    this.cells = [];
    this.mainboard = true;

    this.cells.push(document.getElementById("1"));
    this.cells.push(document.getElementById("2"));
    this.cells.push(document.getElementById("3"));

    this.cells.push(document.getElementById("4"));
    this.cells.push(document.getElementById("5"));
    this.cells.push(document.getElementById("6"));

    this.cells.push(document.getElementById("7"));
    this.cells.push(document.getElementById("8"));
    this.cells.push(document.getElementById("9"));

    this.X = [];
    this.O = [];
    this.playerOne = true;
};

GameBoard.prototype.cellFree = function (cell) {
    if (this.X.indexOf(cell) < 0 && this.O.indexOf(cell) < 0) return true;
    else return false;
};

GameBoard.prototype.move = function (cell) {
    if (this.cellFree(cell)) {
        this.playerOne ? this.X.push(cell) : this.O.push(cell);
        var c = this.cells[cell - 1];
        if (this.mainboard) {
            c.className = this.playerOne ? "X" : "O";
            c.innerHTML = this.playerOne ? "X" : "O";
        }
        this.playerOne = !this.playerOne;
    }

    return this.gameOver();
};

GameBoard.prototype.gameOver = function () {
    var Xwin = false;
    var Owin = false;
    var draw = false;
    if (this.X.length > 2) {
        for (var i = 0; i < this.X.length - 2; i++) {
            for (var j = i + 1; j < this.X.length - 1; j++) {
                for (var k = j + 1; k < this.X.length; k++) {
                    if (this.X[i] + this.X[j] + this.X[k] === 15) Xwin = true;
                }
            }
        }
    }
    if (this.O.length > 2) {
        for (var i = 0; i < this.O.length - 2; i++) {
            for (var j = i + 1; j < this.O.length - 1; j++) {
                for (var k = j + 1; k < this.O.length; k++) {
                    if (this.O[i] + this.O[j] + this.O[k] === 15) Owin = true;
                }
            }
        }
    }
    if (this.X.length + this.O.length === 9) draw = true;
    if (Xwin) return 1;
    if (Owin) return 2;
    if (draw) return 3;
    return 0;
};

GameBoard.prototype.reset = function () {
    for (var i = 0; i < this.cells.length; i++) {
        var c = this.cells[i];
        if (this.mainboard) {
            c.className = "";
            c.innerHTML = i + 1;
        }
    }
    this.X = [];
    this.O = [];
    this.playerOne = true;
};

GameBoard.prototype.clone = function () {
    var gb = new GameBoard();
    for (var i = 0; i < this.X.length; i++) {
        gb.X.push(this.X[i]);
    }
    for (var i = 0; i < this.O.length; i++) {
        gb.O.push(this.O[i]);
    }
    gb.playerOne = this.playerOne;
    gb.mainboard = false;
    return gb;
};

GameBoard.prototype.playGame = function (pOne, pTwo, cb) {
    var that = this;

    function loop() {
        if (that.playerOne) that.move(pOne.selectMove(that.clone()));
        else that.move(pTwo.selectMove(that.clone()));
        if (that.gameOver() === 0) {
            window.setTimeout(requestAnimationFrame, 1, loop);
        } else {
            window.setTimeout(cb, 1, that, that.gameOver());
            // console.log("game over");
        }
    }
    if (this.gameOver() === 0) {
        requestAnimationFrame(loop);
    }
};

window.onload = function () {

    var newGame = document.getElementById("New Game");

    var gb = new GameBoard();
    var playerOne = new Agent();
    var playerTwo = new Agent();

    newGame.onclick = function () {
        gb.reset();
        gb.playGame(playerOne, playerTwo);
    };

    var games = [];
    var states = [];
    for (var i = 0; i < 25; i++) {
        states.push(3);
    }
    for (var i = 0; i < 20; i++) {
        states.push(1);
    }
    for (var i = 0; i < 5; i++) {
        states.push(2);
    }
    // // draws
    games.push([]);
    games.push([5]);
    games.push([1]);
    games.push([8]);
    games.push([8, 5]);
    games.push([5, 8]);
    games.push([5, 6]);
    games.push([5, 2]);
    games.push([5, 4]);
    games.push([5, 8, 2]);
    games.push([5, 6, 2]);
    games.push([5, 2, 6]);
    games.push([5, 4, 2]);
    games.push([5, 8, 4]);
    games.push([5, 6, 4]);
    games.push([5, 2, 4]);
    games.push([5, 4, 6]);
    games.push([5, 3, 7, 4]);
    games.push([7, 5, 9, 4]);
    games.push([7, 5, 9, 2]);
    games.push([5, 8, 3]);
    games.push([5, 2, 7]);
    games.push([4, 5, 9]);
    games.push([8, 5, 3]);
    games.push([6, 5, 7]);

    // // win
    games.push([5, 8, 2, 1]);
    games.push([5, 9, 7, 2]);
    games.push([5, 7, 1]);
    games.push([5, 3, 8]);
    games.push([5, 7, 6]);
    games.push([8, 3, 1]);
    games.push([5, 3, 9]);
    games.push([5, 1]);
    games.push([5, 9]);
    games.push([5, 3]);
    games.push([5, 7]);
    games.push([5, 3, 9, 4]);
    games.push([5, 8, 3, 1]);
    games.push([5, 7, 1, 2]);
    games.push([5, 3, 8, 9]);
    games.push([5, 7, 6, 9]);
    games.push([8, 3, 1, 5]);
    games.push([4, 5, 9, 3]);
    games.push([8, 5, 3, 1]);
    games.push([6, 5, 7, 1]);
    games.push([5, 8, 2, 1, 7]);
    games.push([5, 9, 7, 2, 6]);
    games.push([5, 3, 7, 4, 9]);
    games.push([7, 5, 9, 4, 2]);
    games.push([7, 5, 9, 2, 6]);


    var indexer = 0;
    var score = 0;

    function testGame(gb, cond) {
        if (cond !== undefined) {
            if (cond === states[indexer++]) {
                score++;
                console.log(cond === states[indexer - 1]);
            }
        }
        if (indexer < games.length) {
            gb.reset();
            var list = games[indexer];
            for (var i = 0; i < list.length; i++) {
                gb.move(list[i]);
            }
            // console.log("game begins");
            gb.playGame(playerOne, playerTwo, testGame);
        }
        else {
            console.log(score + " tests passed.");
        }
    };

    console.log(states.length);
    window.setTimeout(testGame, 1, gb);

    console.log("Window loaded.");
};