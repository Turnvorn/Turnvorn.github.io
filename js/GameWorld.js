class GameWorld {
  constructor(canvasId) {
    // HTML Canvas object
    this.canvas = null;
    this.context = null;
    // Screen width and height
    this.width = 1600;
    this.height = 900;
    // Timestamp for gameloop
    // to know how many seconds have passed
    this.oldTimeStamp = 0;

    // Array of enemies currently spawned in the level
    // They will be deleted once they are shot or finished
    this.enemies = [];
    // Array of owned Towers currently in the level
    this.towers = [];

    // Available coordinates to build a tower
    // example [[123,456],[999,444]]
    this.availableCoords = [];
    // ...also stored as strings for easy comparison
    // example ["123,456","999,444"]
    this.avaiableCoordsStrings = [];

    this.level = 1;
    this.levelSeconds = 0;
    this.levelEnemyCounter = 0;
    this.wave = 0;
    // Make sure available spots in level are only set once
    this.levelHasAvailableSpots = 0;

    this.levelSpawnedEnemis = 0;

    // Current mouse position
    // and snap to grid mouse position relative to that
    this.mouseX = 0;
    this.mouseY = 0;
    this.snapX = 0;
    this.snapY = 0;
    // Mouse selection, new tower etc.
    this.selection = null;

    // Inventory
    this.coins = 190;

    // Level start coords
    this.start = { x: 0, y: 0 };

    // Print coords of each object,
    // grid, health etc. on screen
    this.debugging = false;

    this.init(canvasId);
  }

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    console.log(canvas.width);
    // Click listener for inventory, create tower etc.
    this.canvas.addEventListener("click", () => {
      if (this.selection === "dart") {
        this.dartTower();
      }
      // TODO: Make more dynamic, not hardcoded per item
      if (this.snapX === 150 && this.snapY === 800) {
        this.selection = "dart";
      } else {
        this.selection = null;
      }

      if (this.debugging) {
        console.log(this.snapX + "," + this.snapY);
      }
    });

    // Mouse move listener and store closest grid value
    // Currently the grid is 50x50 pixels
    this.canvas.addEventListener("mousemove", (e) => {
      var mousePos = Mouse.getMousePos(this.canvas, e);
      this.mouseX = mousePos.x;
      this.mouseY = mousePos.y;
      var snap = Mouse.snapToGrid(mousePos.x, mousePos.y);
      this.snapX = snap.x;
      this.snapY = snap.y;
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
        Helpers.removeItemOnce(
          this.avaiableCoordsStrings,
          this.snapX + "," + this.snapY
        );

        this.coins -= 100;
        this.towers.push(
          new Tower(this.context, this.snapX, this.snapY, 0, 0, 0, 1)
        );
      }
    }
  };

  createGrid() {
    var currentX = 0;
    var currentY = 0;
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

  gameLoop(timeStamp) {
    // Calculate how much time has passed
    var secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    this.levelSeconds += secondsPassed;
    this.oldTimeStamp = timeStamp;

    // Todo remove with play button
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
      //One.draw(this.context, this.availableCoords)
      One.draw(this.context, this.availableCoords);
    }

    if (this.debugging) this.createGrid();

    Mouse.drawCursor(this.context, this.mouseX, this.mouseY, this.selection);

    //Mouse.drawInventory(this.context, this.coins, this.wave);
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


  drawInventory = () => {
    this.context.fillStyle = "#fff";
    this.context.font = "100px Verdana";
    this.context.fillText(this.coins + "$", this.width / 2 - 100, 828 + 36);

    this.context.fillStyle = "#ccc";
    this.context.font = "50px Verdana";
    this.context.fillText("WAVE " + this.wave, this.width / 2 - 80, 750);
    this.context.beginPath();

    this.context.fillStyle = "#FDE74C";
    this.context.font = "25px Verdana";
    this.context.fillText("DART TOWER 100$", 50, 828 + 36);
    this.context.fillStyle = "#FDE74C";
    this.context.arc(150, 800, 20, 0, 2 * Math.PI);
    this.context.fill();
  };

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
      this.context.fillStyle = "rgba(50, 175, 100, 1)";
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
        [1200, 500],
        [1500, 300]
      ];
      // Also make a string version for easy comparison
      this.availableCoords.forEach((ele) => {
        this.avaiableCoordsStrings.push(ele[0] + "," + ele[1]);
      });
    }
    // Enemy spawns at these coords
    this.start = { x: 0, y: 400 };

    // Start when first tower gets built
    // TODO: Use play button or something similar
    if (this.towers.length > 0) {
      if (this.wave === 0) this.wave += 1;
      var i;
      for (i = 0; i < 1 + 2 * this.wave; i++) {
        var random = Math.floor(Math.random() * 50) + 1;

        var size = 10;
        var health = 1;
        if (this.wave === 8 || this.wave === 12) {
          size = 30;
          health = 2;
        }
        var enemy = new Enemy(
          this.context,
          this.start.x - random,
          this.start.y,
          64 * 2,
          0,
          1
        );
        enemy.radius = size;
        enemy.health = health;
        enemy.color = "black";
        this.spawnEnemy(i, i / 3, enemy);
      }
    } else {
      this.levelSeconds = 0; // Round not begun
    }
  }

  // Give each enemy a number 0,1,2...n
  // Specify at which second he should spawn (0,1,2...etc.)
  // And which enemy(object) to push to the enemy array
  spawnEnemy(number, second, object) {
    // Check if the enemy has already been placed
    if (this.levelSpawnedEnemis <= number) {
      // Wait for the right time to place it
      if (this.levelSeconds > second) {
        this.levelSpawnedEnemis += 1;
        this.enemies.push(object);
      }
    }

    // New wave when all enemies are dead
    if (this.enemies.length === 0 && this.levelSeconds > 1) {
      this.levelSpawnedEnemis = 0;
      this.levelSeconds = 0;
      this.wave += 1;
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

        if (Helpers.circleIntersect(tower, enemy)) {
          enemiesInRange.push(enemy);

          // TODO: This should be elsewhere
          // DetectCasualties() or something
          if (enemy.health <= 0) {
            // TODO: Add to helpers.js
            var removeIndex = this.enemies
              .map(function (item) {
                return item.id;
              })
              .indexOf(enemy.id);

            // remove object
            this.enemies.splice(removeIndex, 1);
            // TODO: This should be elsewhere
            this.coins += 5;
          }
        }
      }
      tower.enemies = enemiesInRange;
    }
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
