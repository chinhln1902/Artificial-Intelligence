// TCSS 435 - Pacman
// Author: Dr.Marriott - Chinh Le 
// StudentID: 1841162
var GAMEBOARD = [];

var getXY = function(x, y) {
  var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP/2)/BUBBLES_GAP);
  var j = Math.floor((y - BUBBLES_Y_START + 9)/17.75);

  return {x: i, y: j}
}

var buildGameboard = function () {
  GAMEBOARD = [];
  for(var i = 0; i < 26; i++) {
    GAMEBOARD.push([]);
    for(var j = 0; j < 29; j++) {
      GAMEBOARD[i].push({
        bubble: false,
        superBubble: false,
        inky: false,
        pinky: false,
        blinky: false,
        clyde: false,
        pacman: false,
        eaten: false,
        parent: null
      });
    }
  }


  for(var i = 0; i < BUBBLES_ARRAY.length; i++) {
    var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
    var y = parseInt(bubbleParams[1]) - 1;
    var x = parseInt(bubbleParams[2]) - 1;
    var type = bubbleParams[3];
    var eaten = parseInt(bubbleParams[4]);
    if (type === "b") {
      GAMEBOARD[x][y].bubble = true;
    } else {
      GAMEBOARD[x][y].superBubble = true;
    }
    if(eaten === 0) {
      GAMEBOARD[x][y].eaten = false;
    } else {
      GAMEBOARD[x][y].eaten = true;
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if(!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble){
          GAMEBOARD[i][j] = null;
      }
    }
  }

  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      if((i === 0 && (j === 13)) ||
      (i === 1 && (j === 13)) ||
      (i === 2 && (j === 13)) ||
      (i === 3 && (j === 13)) ||
      (i === 4 && (j === 13)) ||
      (i === 6 && (j === 13)) ||
      (i === 7 && (j === 13)) ||
      (i === 8 && (j >= 10 && j <= 18)) ||
      (i === 9 && (j === 10 || j === 16)) ||
      (i === 10 && (j === 10 || j === 16)) ||
      (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 12 && (j === 10 || j === 16)) ||
      (i === 13 && (j === 10 || j === 16)) ||
      (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
      (i === 15 && (j === 10 || j === 16)) ||
      (i === 16 && (j === 10 || j === 16)) ||
      (i === 17 && (j >= 10 && j <= 18)) ||
      (i === 18 && (j === 13)) ||
      (i === 19 && (j === 13)) ||
      (i === 21 && (j === 13)) ||
      (i === 22 && (j === 13)) ||
      (i === 23 && (j === 13)) ||
      (i === 24 && (j === 13)) ||
      (i === 25 && (j === 13)))  {
        GAMEBOARD[i][j] = {
          bubble: false,
          superBubble: false,
          inky: false,
          pinky: false,
          blinky: false,
          clyde: false,
          pacman: false,
          eaten: false
        };
      }
    }
  }

  var p = getXY(GHOST_INKY_POSITION_X,GHOST_INKY_POSITION_Y);
  
  if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].inky = true;
    p = getXY(GHOST_PINKY_POSITION_X,GHOST_PINKY_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pinky = true;
    p = getXY(GHOST_BLINKY_POSITION_X,GHOST_BLINKY_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].blinky = true;
    p = getXY(GHOST_CLYDE_POSITION_X,GHOST_CLYDE_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].clyde = true;
    p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if(p && GAMEBOARD[p.x] && GAMEBOARD[p.x][p.y] && p.x >= 0 && p.x < 26) GAMEBOARD[p.x][p.y].pacman = true;
  
};

function drawRect(i,j) {
  var ctx = PACMAN_CANVAS_CONTEXT;
  var ygap = 17.75;
  var x = BUBBLES_X_START + i*BUBBLES_GAP - BUBBLES_GAP/2;
  var y = BUBBLES_Y_START + j*ygap- 9;
  var w = BUBBLES_GAP;
  var h = ygap;

  if (GAMEBOARD[i] === undefined) {undefined;}
  if(GAMEBOARD[i][j]){
    ctx.strokeStyle = "green";
    ctx.rect(x,y,w,h);
    ctx.stroke();
  }
}

function drawDebug() {
  for(var i = 0; i < 26; i++) {
    for(var j = 0; j < 29; j++) {
      drawRect(i,j);
    }
  }
}

function selectMove() {
    buildGameboard();
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
      var pacmanPosition = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
      var bestMove = bfs(pacmanPosition);
      movePacman(bestMove);
    }
};

function findClosestBubble() {
    var superBubble = [];
    var normalBubble = [];

    var distances = [];
    var pacmanPos = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    var minDistance;
    
    for (var i = 0; i < BUBBLES_ARRAY.length; i++) {
      var bubbleParams = BUBBLES_ARRAY[i].split( ";" );
      var bubblePosY = parseInt(bubbleParams[1]) - 1;
      var bubblePosX = parseInt(bubbleParams[2]) - 1;
      var type = bubbleParams[3];
      var eaten = parseInt(bubbleParams[4]);
      if (type === "s" && eaten === 0) {
        superBubble.push({x: bubblePosX, y: bubblePosY});
      } else if (type === "b" && eaten === 0) {
        normalBubble.push({x: bubblePosX, y: bubblePosY});
      }
    }


    if (superBubble.length > 0 && !ghostIsBlinking()) {
      for (var i = 0; i < superBubble.length; i++) {
        var distance = Math.sqrt(Math.pow(pacmanPos.y - superBubble[i].y, 2) + Math.pow(pacmanPos.x - superBubble[i].x, 2));
        distances.push({dist: distance, bubblePos: superBubble[i]});
      }
      minDistance = distances[0];
      for (var i = 1; i < distances.length; i++) {
        if (distances[i].dist < minDistance.dist) {
          minDistance = distances[i];
        }
      }
    } else { 
      for (var i = 0; i < normalBubble.length; i++) {
        var distance = Math.sqrt(Math.pow(pacmanPos.y - normalBubble[i].y, 2) + Math.pow(pacmanPos.x - normalBubble[i].x, 2));
        distances.push({dist: distance, bubblePos: normalBubble[i]});
      }
      minDistance = distances[0];
      for (var i = 1; i < distances.length; i++) {
          if (distances[i].dist < minDistance.dist) {
            minDistance = distances[i];
          }
      }
    }
    return minDistance.bubblePos;
}

function bfs(pacmanPos) {
  var closestBubble = findClosestBubble();
  var queue = [];
  var isFound = false;
  var direction;
  queue.push(pacmanPos);
  while (!isFound) {
    var current = queue.shift();
    if (current === undefined || closestBubble === undefined) {
      if (canMovePacman(PACMAN_DIRECTION)) {
        return PACMAN_DIRECTION;
      }
      else if (canMovePacman(reverseDirection(PACMAN_DIRECTION))) { 
        return reverseDirection(PACMAN_DIRECTION) 
      }
      for (var i = 1; i < 5; i ++) {
        if (canMovePacman(i)) {
          return i;
        }
      }
    }
    if (current.x === closestBubble.x && current.y === closestBubble.y) {
      isFound = true;
      direction = backTrack(closestBubble, pacmanPos).direction;
    } else {
      var neighbors = getNeighbors(current);
      for (var i = 0; i < neighbors.length; i++) {
        queue.push(neighbors[i]);
      }
    }
  }
  return direction;
}

function ghostIsBlinking () {
  if (GHOST_CLYDE_AFFRAID_TIMER !== null || GHOST_INKY_AFFRAID_TIMER !== null || GHOST_BLINKY_AFFRAID_TIMER !== null || GHOST_PINKY_AFFRAID_TIMER !== null) {
    return true;
  } else {
    return false;
  }
}

function backTrack(start, end) {
  var lastPosition = GAMEBOARD[start.x][start.y].parent;
  var oneAway = false;
  var count = 0;
  if (isCloseToBubble(start, end)) {
    return {direction: getDirection(end, start), distance: 0};
  }
  while(!oneAway && lastPosition !== null) {
    var x = lastPosition.x;
    var y = lastPosition.y
    
    if ((GAMEBOARD[x][y].parent === null||GAMEBOARD[x][y].parent.x === end.x) && GAMEBOARD[x][y].parent.y === end.y) {
      oneAway = true;
    } else {
      lastPosition = GAMEBOARD[x][y].parent;
      count++;
    }
  }
  if (lastPosition === null) {
    return {direction: getDirection(end, start), distance: 0};
  }
  return {direction: getDirection(end, lastPosition), distance: count};
}

function isCloseToBubble(start, end) {
  var result = false;
  if ((end.y === start.y && end.x === start.x) || (end.y+1 === start.y && end.x === start.x) || (end.y-1 === start.y && end.x === start.x) 
  || (end.x+1 === start.x && end.y === start.y) || (end.x-1 === start.x && end.y === start.y)) {
    result = true;
  }
  return result;
}

function getDirection(start, previousPos) {
  if (start.x + 1 === previousPos.x && start.y === previousPos.y) {
    return 1;
  } else if (start.x - 1 === previousPos.x && start.y === previousPos.y) {
    return 3;
  } else if (start.x === previousPos.x && start.y + 1 === previousPos.y) {
    return 2;
  } else {
    if (start.x === previousPos.x && start.y === previousPos.y) {
      return PACMAN_DIRECTION;
    } else {
      return 4;
    }
  }
}

function reverseDirection(direction) {
  if (direction === 1) {
    return 3;
  } else if (direction === 2) {
    return 4;
  } else if (direction === 3) {
    return 1;
  } else {
    return 2;
  }
}

function getNeighbors(position) {
  var neighbors = [];
  if (position.x !== 25 && GAMEBOARD[position.x + 1][position.y]!== null &&
      GAMEBOARD[position.x + 1][position.y].parent === null) {
    GAMEBOARD[position.x + 1][position.y].parent = position;
    neighbors.push({x: position.x + 1, y: position.y});
  }
  if (position.x !== 0 && GAMEBOARD[position.x - 1][position.y]!== null &&
     GAMEBOARD[position.x - 1][position.y].parent === null) {
    GAMEBOARD[position.x - 1][position.y].parent = position;
    neighbors.push({x: position.x - 1, y: position.y});
  }
  if (position.y !== 28 && GAMEBOARD[position.x][position.y + 1]!== null &&
     GAMEBOARD[position.x][position.y + 1].parent === null) {
    GAMEBOARD[position.x][position.y + 1].parent = position;
    neighbors.push({x: position.x, y: position.y + 1});
  }
  if (position.y !== 0 && GAMEBOARD[position.x][position.y - 1]!== null &&
      GAMEBOARD[position.x][position.y - 1].parent === null) {
    GAMEBOARD[position.x][position.y - 1].parent = position;
    neighbors.push({x: position.x , y: position.y - 1});
  }
  return neighbors;
}
setInterval(drawDebug, 1000/3);
