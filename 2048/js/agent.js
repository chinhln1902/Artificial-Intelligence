// TCSS 435 - 2048
// Dr.Marriott
// Chinh Le
// StudentID: 1841162

function randomInt(n) {
    return Math.floor(Math.random() * n);
};

function AgentBrain(gameEngine) {
    this.size = 4;
    this.previousState = gameEngine.grid.serialize();
    this.reset();
    this.score = 0;
};

AgentBrain.prototype.reset = function () {
    this.score = 0;
    this.grid = new Grid(this.previousState.size, this.previousState.cells);
};

// Adds a tile in a random position
AgentBrain.prototype.addRandomTile = function () {
    if (this.grid.cellsAvailable()) {
        var value = Math.random() < 0.9 ? 2 : 4;
        var tile = new Tile(this.grid.randomAvailableCell(), value);

        this.grid.insertTile(tile);
    }
};

AgentBrain.prototype.moveTile = function (tile, cell) {
    this.grid.cells[tile.x][tile.y] = null;
    this.grid.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
AgentBrain.prototype.move = function (direction) {
    // 0: up, 1: right, 2: down, 3: left
    var self = this;

    var cell, tile;

    var vector = this.getVector(direction);
    var traversals = this.buildTraversals(vector);
    var moved = false;

    //console.log(vector);

    //console.log(traversals);

    // Traverse the grid in the right direction and move tiles
    traversals.x.forEach(function (x) {
        traversals.y.forEach(function (y) {
            cell = { x: x, y: y };
            tile = self.grid.cellContent(cell);

            if (tile) {
                var positions = self.findFarthestPosition(cell, vector);
                var next = self.grid.cellContent(positions.next);

                // Only one merger per row traversal?
                if (next && next.value === tile.value && !next.mergedFrom) {
                    var merged = new Tile(positions.next, tile.value * 2);
                    merged.mergedFrom = [tile, next];

                    self.grid.insertTile(merged);
                    self.grid.removeTile(tile);

                    // Converge the two tiles' positions
                    tile.updatePosition(positions.next);

                    // Update the score
                    self.score += merged.value;

                } else {
                    self.moveTile(tile, positions.farthest);
                }

                if (!self.positionsEqual(cell, tile)) {
                    moved = true; // The tile moved from its original cell!
                }
            }
        });
    });
    //console.log(moved);
//    if (moved) {
//        this.addRandomTile();
//    }
    return moved;
};

// Get the vector representing the chosen direction
AgentBrain.prototype.getVector = function (direction) {
    // Vectors representing tile movement
    var map = {
        0: { x: 0, y: -1 }, // Up
        1: { x: 1, y: 0 },  // Right
        2: { x: 0, y: 1 },  // Down
        3: { x: -1, y: 0 }   // Left
    };

    return map[direction];
};

// Build a list of positions to traverse in the right order
AgentBrain.prototype.buildTraversals = function (vector) {
    var traversals = { x: [], y: [] };

    for (var pos = 0; pos < this.size; pos++) {
        traversals.x.push(pos);
        traversals.y.push(pos);
    }

    // Always traverse from the farthest cell in the chosen direction
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();

    return traversals;
};

AgentBrain.prototype.findFarthestPosition = function (cell, vector) {
    var previous;

    // Progress towards the vector direction until an obstacle is found
    do {
        previous = cell;
        cell = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(cell) &&
             this.grid.cellAvailable(cell));

    return {
        farthest: previous,
        next: cell // Used to check if a merge is required
    };
};

AgentBrain.prototype.positionsEqual = function (first, second) {
    return first.x === second.x && first.y === second.y;
};

function Agent() {
};

Agent.prototype.selectMove = function (gameManager) {
    var brain = new AgentBrain(gameManager);
    var bestScores = [];
    var moved = false;
    var depth = 5;
    // Use the brain to simulate moves
    // brain.move(i) 
    // i = 0: up, 1: right, 2: down, 3: left
    // brain.reset() resets the brain to the current game board

    // if (brain.move(0)) return 0;
    // if (brain.move(1)) return 1;
    // if (brain.move(3)) return 3;
    // if (brain.move(2)) return 2;

    for (var i = 0; i < 4; i++) {
        moved = brain.move(i)

        if (moved) {
            bestScores.push(this.expectiMax(brain, depth - 1, false));
            brain.reset();
        } else {
            bestScores.push(-Infinity);
        }
    }
    
    var maxValue = Math.max.apply(null, bestScores);
    return bestScores.indexOf(maxValue);
};

Agent.prototype.evaluateGrid = function (gameManager) {
    var cells = gameManager.cells;
    var cell = null;
    var cornerScore = 0;
    var largeTileNum = 0;
    var tilesNum = 0;
    var different = 0;
    var highestTile = 0;
    var highestX = 0;
    var highestY = 0;


    for (var i = 0; i < 4; i++) {
        var rowTile = [];
        for (var j = 0; j < 4; j++) {
            cell = cells[i][j];

            if (cell != null) {
                tilesNum++;
                rowTile.push(cell.value);

                if (highestTile < cell.value) {
                    highestTile = cell.value;
                    highestX = cell.x;
                    highestY = cell.y;
                }

                if (cell.value >= 128 && !isAtCenter(cell.x, cell.y)) {
                    cornerScore += cell.value;
                }

                if (cell.value > 32) {
                    largeTileNum++;
                }
            }
        }

        different = different + this.calculateDifference(rowTile);
    }

    for (var j = 0; j < 4; j++) {
        var colTileValues = [];

        for (var i = 0; i < 4; i++) {
            cell = cells[i][j];

            if (cell != null) {
                colTileValues.push(cell.value);
            }
        }

        different = different + this.calculateDifference(colTileValues);
    }

    highestTile = highestTile / 2;

    if (isAtCorner(highestX, highestY)) {
        return 5000 * (16 - tilesNum) - 240 * different + 50 * highestTile + 2 * cornerScore - 1600 * largeTileNum;
    } else {
        return 5000 * (16 - tilesNum) - 240 * different - 10 * highestTile + 2 * cornerScore - 1600 * largeTileNum;
    }
};

Agent.prototype.expectiMax = function(brain, depth, isMaximizer) {
    var lastScore = brain.score;
    var lastState = brain.grid.serialize();

    if (depth == 0 || !brain.grid.cellsAvailable()) {
        return this.evaluateGrid(brain.grid);
    }

    if (isMaximizer) {
        var maxValue = -Infinity;
        var moved = false;

        for (var i = 0; i < 4; i++) {
            moved = brain.move(i);

            if (moved) {
                var value = this.expectiMax(brain, depth - 1, !isMaximizer);
                maxValue = Math.max(value, maxValue);
                brain.grid = new Grid(lastState.size, lastState.cells);
                brain.score = lastScore;
            }
        }

        return maxValue;
    } else {
        var highestScore = 0;
        var cells = brain.grid.availableCells();

        for (var i = 0; i < cells.length; i++) {
            brain.grid.insertTile(new Tile(cells[i], 2));
            highestScore += (1.0 / cells.length) * 0.9 * this.expectiMax(brain, depth - 1, !isMaximizer);
            brain.grid = new Grid(lastState.size, lastState.cells);
            brain.score = lastScore;
        }

        return highestScore;
    }
};

Agent.prototype.calculateDifference = function (tileValues) {
    var getHigher = true;
    var getLower = true;
    var different = 0;

    for (var i = 0; i < tileValues.length - 1; i++) {
        getHigher = getHigher && (tileValues[i] <= tileValues[i + 1]);
        getLower = getLower && (tileValues[i] >= tileValues[i + 1]);
        var max = Math.max(tileValues[i], tileValues[i + 1]);
        var min = Math.min(tileValues[i], tileValues[i + 1]);
        different = different + max / min;
    }

    if (getHigher || getLower) {
        if (length == 3 && different <= 4) {
            return -5 * (7 - different);
        } else if (length == 4 && different <= 6) {
            return -10 * (9 - different);
        } else if (length == 3 && different <= 12) {
            return -3 * (15 - different);
        } else if (length == 4 && different <= 18) {
            return -5 * (21 - different);
        } else if (different <= 30) {
            return -10;
        } else {
            return -5;
        }
    } else {
        if (different < 10) {
            return different;
        } else {
            return 3 * different;
        }
    }
}

function isAtCorner (x, y) {
    var result = false;
    if ((x === 0 && y === 0) || (x === 0 && y === 3) || (x === 3 && y === 0) || (x === 3 && y === 3)) {
        result = true;
    }
    return result;
}
function isAtCenter (x, y) {
    var result = false;
    if ((x === 1 && y === 1) || (x === 1 && y === 2) || (x === 2 && y === 1) || (x === 2 && y === 2)) {
        result = true;
    }
    return result; 
}