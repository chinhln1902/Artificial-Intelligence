// TCSS 435 - Zombie
// Dr.Marriott
// Chinh Le
// StudentID: 1841162

function cl(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "CLE";
    this.color = "Yellow";
    this.cooldown = 0;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.velocity = { x: 0, y: 0 };
};

cl.prototype = new Entity();
cl.prototype.constructor = cl;

cl.prototype.selectAction = function () {

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000;
    var closestZombie = 1000;
    var closestRockDist = 1000;
    var closetRock = null;
    var target = null;
    this.visualRadius = 500;

    for (var i = 0; i < this.game.zombies.length; i++) {
        var zombie = this.game.zombies[i];
        var dist = distance(zombie, this);
        if (dist < closestZombie) {
            closestZombie = dist;
            target = zombie;
        }
        if (this.collide({x: zombie.x, y: zombie.y, radius: this.visualRadius})) {
            var dir = direction(zombie, this);
            action.direction.x = action.direction.x - 1.75 * dir.x * acceleration / (dist * dist);
            action.direction.y = action.direction.y - 1.75 * dir.y * acceleration / (dist * dist);
        }
    }

    for(var i = 0; i < this.game.players.length; i++) {
      var player = this.game.players[i];
      var dist = distance(this, player);
      var distBetweenPlayers = .33;
      if(dist != 0) {
        if(this.collide({x:player.x, y:player.y, radius:this.visualRadius})) {
            var dir = direction(player, this);
            action.direction.x = action.direction.x - distBetweenPlayers * dir.x * acceleration / (dist * dist);
            action.direction.y = action.direction.y - distBetweenPlayers * dir.y * acceleration / (dist * dist);
        }
      }
    }

    for (var i = 0; i < this.game.rocks.length; i++) {
        var rock = this.game.rocks[i];
        if (!rock.removeFromWorld && !rock.thrown && this.rocks < 2 && this.collide({ x: rock.x, y: rock.y, radius: this.visualRadius })) {
            var dist = distance(this, rock);
            var rockFactor = 0;
            if (this.rocks === 0) {
                rockFactor = 1.5;
            } else {
                rockFactor = 1;
            }
            if (dist < closestRockDist) {
              closestRockDist = dist;
              closetRock = rock;
            }
            if (dist > this.radius + rock.radius) {
                var difference = {x:(rock.x - this.x) / dist, y:(rock.y - this.y) / dist };
                var dir = direction(rock, this);
                action.direction.x = action.direction.x + rockFactor * dir.x * acceleration / (dist * dist);
                action.direction.y = action.direction.y + rockFactor * dir.y * acceleration / (dist * dist);
            }
        }
    }

    if (closestRockDist < closestZombie) {
        var dir = direction(closetRock, this);
        action.direction.x = action.direction.x + dir.x * acceleration / (dist * dist);
        action.direction.y = action.direction.y + dir.y * acceleration / (dist * dist);
    } else {
        var center = {x: 400, y: 400};
        var largeBound = 500;
        var smallBound = 300;
        var dist = distance(this, center);
        var corner = direction(this, center);
        var fixX = 0;
        var fixY = 0;
        var cornerX = dist / 75;
        var cornerY = dist / 80;
        var CloseToCornerX = cornerX * 1/2;
        var CloseToCornerY = cornerY * 1/2;
        if(dist > largeBound) {
          fixX =  acceleration * corner.x * (Math.exp(cornerX) - 1) / (dist * dist);
          fixY =  acceleration * corner.y * (Math.exp(cornerY) - 1)/ (dist * dist);
        } else {
            if (dist > smallBound) {
                fixX =  acceleration * corner.x * (Math.exp(CloseToCornerX) - 1) / (dist * dist);
                fixY =  acceleration * corner.y * (Math.exp(CloseToCornerY) - 1) / (dist * dist);
            }
        }
        action.direction.x = action.direction.x - fixX;
        action.direction.y = action.direction.y - fixY;
    }

    if (target) {
        var longRange = 180;
        var shortRange = 100;
        var difX = target.x - this.x;
        var difY = target.y - this.y;
        var velocity = this.getVelocity(target);
        var dotProduct = this.dotProduct(target, difX, difY);
        action.target = {
            x: this.getXY(true, velocity, difX, difY, target, dotProduct),
            y: this.getXY(false, velocity, difX, difY, target, dotProduct)
        }
        var dist = distance(this, action.target);
        if(action.target) {
            if ((this.rocks === 2 && (dist < longRange)) || (this.rocks === 1 && (dist < shortRange))) {
                action.throwRock = true;
            } else {
                action.throwRock = false;
            }
        }
      }
    return action;
};

cl.prototype.getXY = function(isX, velocity, difX, difY, target, dotProduct) {
    return (isX)
     ? target.x + this.getTime(dotProduct, velocity, difX, difY) * target.velocity.x
     : target.y + this.getTime(dotProduct, velocity, difX, difY) * target.velocity.y;
}

cl.prototype.getVelocity = function(target) {
    return (target.velocity.x * target.velocity.x) + (target.velocity.y * target.velocity.y) - (200 * 200);
}

cl.prototype.dotProduct = function(target, difX, difY) {
    return difX * target.velocity.x + difY * target.velocity.y;
}

cl.prototype.getTime = function(dotProduct, velocity, difX, difY) {
    if(velocity === 0) {
        return -(Math.pow(difX, 2) + Math.pow(difY, 2)) / 2 * dotProduct;
      } else{
        var quotient = -dotProduct / velocity;
        var root = Math.sqrt(quotient * quotient - (quotient * quotient + difY * difY) / velocity);
        return (quotient + root > 0 && quotient - root > 0) ? Math.min(quotient + root, quotient - root) 
                                                            : Math.max(quotient + root, quotient - root);
      }
}
// do not change code beyond this point

cl.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

cl.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

cl.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

cl.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

cl.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

cl.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
            }
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
        var target = this.action.target;
        var dir = direction(target, this);

        var rock = new Rock(this.game);
        rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
        rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
        rock.velocity.x = dir.x * rock.maxSpeed;
        rock.velocity.y = dir.y * rock.maxSpeed;
        rock.thrown = true;
        rock.thrower = this;
        this.game.addEntity(rock);
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

cl.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};