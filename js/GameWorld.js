class GameWorld {
  constructor(canvasId) {
    this.canvas = null;
    this.context = null;
    this.width = 1600;
    this.height = 900;
    this.oldTimeStamp = 0;
    this.enemies = [];
    this.towers = [];
    // Available coordinates to build a tower
    this.avaiableCoordsStrings = [];
    this.availableCoords = [];
    this.resetCounter = 0;

    this.level = 1;
    this.levelSeconds = 0;
    this.levelEnemyCounter = 0;
    // Make sure available spots in level are only set once
    this.levelHasAvailableSpots = 0;

    this.levelSpawnedEnemis = 0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.snapX = 0;
    this.snapY = 0;

    this.coins = 200;

    // Mouse selection
    this.selection = null;

    this.start = { x: 0, y: 0 };

    this.debugging = false;

    this.init(canvasId);
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    this.createWorld();

    this.canvas.addEventListener("click", () => {
      if (this.selection === "dart") {
        this.dartTower();
      }
      console.log("Clicked " + this.snapX + "," + this.snapY);
      if (this.snapX === 150 && this.snapY === 800) {
        this.selection = "dart";
      } else {
        this.selection = null;
      }
      console.log(this.selection);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      var mousePos = this.getMousePos(this.canvas, e);
    });

    // Request an animation frame for the first time
    // The gameLoop() function will be called as a callback of this request
    window.requestAnimationFrame((timeStamp) => {
      this.gameLoop(timeStamp);
    });
  }

  dartTower = () => {
    if (this.coins >= 100) {
      if (this.avaiableCoordsStrings.includes(this.snapX + "," + this.snapY)) {
        this.removeItemOnce(
          this.avaiableCoordsStrings,
          this.snapX + "," + this.snapY
        );
        console.log(this.avaiableCoordsStrings);
        this.coins -= 100;
        this.towers.push(
          new Tower(this.context, this.snapX, this.snapY, 0, 0, 0, 1)
        );
      }
    }
  };

  removeItemOnce = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  drawInventory = () => {
    this.context.fillStyle = "#fff";
    this.context.font = "100px Verdana";
    this.context.fillText(this.coins + "$", this.width / 2 - 100, 828 + 36);
    this.context.beginPath();

    this.context.fillStyle = "#FDE74C";
    this.context.font = "25px Verdana";
    this.context.fillText("DART TOWER 100$", 50, 828 + 36);
    this.context.fillStyle = "#FDE74C";
    this.context.arc(150, 800, 20, 0, 2 * Math.PI);
    this.context.fill();
  };

  createGrid() {
    var currentX = 0;
    var currentY = 0;
    var divider = 50; // 25 makes 64x36 points
    var width = 1600;
    var height = 900;

    // 1600 x 1200
    // 32 x 18 squares
    // Makes 50x50 even squares

    for (var i = 0; i < 32; i++) {
      currentX += 50;

      // Vertical lines
      this.context.beginPath(); // Start a new path
      this.context.moveTo(currentX, 0); // Move the pen
      this.context.lineTo(currentX, height); // Draw a line
      this.context.stroke(); // Render the path
    }
    for (var i = 0; i < 18; i++) {
      currentY += 50;

      // Horizontal lines
      this.context.beginPath(); // Start a new path
      this.context.moveTo(0, currentY); // Move the pen
      this.context.lineTo(width, currentY); // Draw a line
      this.context.stroke(); // Render the path
    }
  }

  snapToGrid(x, y) {
    var xWidth = 50;
    var yWidth = 50;

    var xOffset = x % xWidth; // Get distance from grid

    if (xOffset > xWidth / 2) {
      // Snap to the right
      x += xWidth - xOffset;
    } else {
      // Snap to the left
      x -= xOffset; // move to grid
    }

    var yOffset = y % yWidth; // Get distance from grid
    if (yOffset > yWidth / 2) {
      // Snap down
      y += yWidth - yOffset;
    } else {
      // Snap up
      y -= yOffset; // move to grid
    }

    return {
      x: x,
      y: y
    };
  }

  drawCursor() {
    var x = this.mouseX;
    var y = this.mouseY;

    var snap = this.snapToGrid(x, y);
    this.snapX = snap.x;
    this.snapY = snap.y;

    if (this.debugging) {
      this.context.fillText(snap.x + "," + snap.y, snap.x, snap.y + 20);
    }
    if (this.selection === "dart") {
      this.context.beginPath();
      this.context.fillStyle = "#FDE74C";
      this.context.arc(snap.x, snap.y, 10, 0, 2 * Math.PI);
      this.context.fillStyle = "rgba(0, 0, 0, 0.1)";
      this.context.arc(snap.x, snap.y, 150, 0, 2 * Math.PI);
      this.context.fill();
    }
  }

  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    this.mouseX =
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
    this.mouseY =
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
    return {
      x: this.mouseX,
      y: this.mouseY
    };
  }

  createWorld() {
    this.enemies = [];
    this.towers = [];
  }

  gameLoop(timeStamp) {
    // Calculate how much time has passed
    var secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.levelSeconds += secondsPassed;
    this.oldTimeStamp = timeStamp;

    if (this.level === 1) {
      this.spawnLevel_1();
    }

    // Loop over all game objects to update
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].update(secondsPassed);
    }
    for (var i = 0; i < this.towers.length; i++) {
      this.towers[i].update(secondsPassed);
    }

    this.detectCollisions();

    this.clearCanvas();

    if (this.level === 1) {
      this.drawLevel_1();
    }

    if (this.debugging) this.createGrid();

    this.drawCursor();

    this.drawInventory();

    // Loop over all game objects to draw
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw();
    }
    for (var i = 0; i < this.towers.length; i++) {
      this.towers[i].draw();
    }

    // The loop function has reached it's end
    // Keep requesting new frames
    window.requestAnimationFrame((timeStamp) => this.gameLoop(timeStamp));
  }

  drawLevel_1 = () => {
    this.context.fillStyle = "#63ad83";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = "#d19a66";
    this.context.fillRect(0, 350, 250, 100);
    this.context.fillRect(150, 450, 100, 200);
    this.context.fillRect(250, 550, 400, 100);
    this.context.fillRect(550, 450, 100, 100);
    this.context.fillRect(550, 350, 1050, 100);

    // Draw available building spots
    this.availableCoords.forEach((ele) => {
      // Shadow
      this.context.beginPath();
      this.context.fillStyle = "rgba(75, 75, 75, 0.5)";
      this.context.arc(ele[0], ele[1] + 7, 35, 0, 2 * Math.PI);
      this.context.fill();
      // Spot
      this.context.beginPath();
      this.context.fillStyle = "rgba(75, 150, 75, 1)";
      this.context.arc(ele[0], ele[1], 35, 0, 2 * Math.PI);
      this.context.fill();
    });

    this.context.fillStyle = "white";
  };

  spawnLevel_1() {
    // Set available tower building spots
    if (this.levelHasAvailableSpots != 1) {
      this.levelHasAvailableSpots = 1;
      this.availableCoords = [
        [300, 500],
        [150, 300],
        [500, 500],
        [700, 500],
        [600, 300],
        [1000, 300],
        [1200, 500]
      ];
      // Also make a string version for easy comparison
      this.availableCoords.forEach((ele) => {
        this.avaiableCoordsStrings.push(ele[0] + "," + ele[1]);
      });
    }
    // 64x36
    this.start = { x: 0, y: 400 };
    var i;
    for (i = 0; i < 20; i++) {
      var random = Math.floor(Math.random() * 50) + 1;
      this.spawnEnemy(
        i,
        i / 3,
        new Enemy(
          this.context,
          this.start.x - random,
          this.start.y,
          64 * 2,
          0,
          1
        )
      );
    }
  }

  spawnEnemy(number, second, object) {
    // Check if the enemy has already been placed
    if (this.levelSpawnedEnemis <= number) {
      // Wait for the right time to place it
      if (this.levelSeconds > second) {
        this.levelSpawnedEnemis += 1;
        this.enemies.push(object);
      }
    }

    // New level
    if (this.enemies.length === 0 && this.levelSeconds > 1) {
      this.levelSpawnedEnemis = 0;
      this.levelSeconds = 0;
    }
  }

  detectCollisions() {
    var enemy;
    var tower;

    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].isColliding = false;
    }

    for (var i = 0; i < this.towers.length; i++) {
      tower = this.towers[i];
      var enemiesInRange = [];

      for (var j = 0; j < this.enemies.length; j++) {
        enemy = this.enemies[j];

        if (this.circleIntersect(tower, enemy)) {
          enemiesInRange.push(enemy);

          if (enemy.health <= 0) {
            // get index of object with id
            var removeIndex = this.enemies
              .map(function (item) {
                return item.id;
              })
              .indexOf(enemy.id);

            // remove object
            this.enemies.splice(removeIndex, 1);

            this.coins += 10;
          }
        }
      }
      tower.enemies = enemiesInRange;
    }
  }

  rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }

    return true;
  }

  circleIntersect(obj1, obj2) {
    var a = obj1.x - obj2.x;
    var b = obj1.y - obj2.y;
    var c = Math.sqrt(a * a + b * b);

    if (c > obj1.radius + obj2.radius) return false;

    return true;
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
