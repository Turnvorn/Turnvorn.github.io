// TODO: Remove from GameWorld and use these methods instead
// Remove this.context etc. and introduce input variables instead

class One {
  // Check if we have placed the available
  // building spot for towers
  static hasSetAvailableCoordinates = false;

  static enemiesHaveBeenSpawned = false;

  // Enemy starts at
  static start = { x: 0, y: 400 };

  static draw = (context, availableCoords) => {
    context.fillStyle = "#63ad83";
    context.fillRect(0, 0, 1600, 900);
    context.fillStyle = "#d19a66";
    context.fillRect(0, 350, 250, 100);
    context.fillRect(150, 450, 100, 200);
    context.fillRect(250, 550, 400, 100);
    context.fillRect(550, 450, 100, 100);
    context.fillRect(550, 350, 1050, 100);

    // Draw available building spots
    availableCoords.forEach((ele) => {
      // Shadow
      context.beginPath();
      context.fillStyle = "rgba(75, 75, 75, 0.5)";
      context.arc(ele[0], ele[1] + 7, 35, 0, 2 * Math.PI);
      context.fill();
      // Spot
      context.beginPath();
      context.fillStyle = "rgba(50, 175, 100, 1)";
      context.arc(ele[0], ele[1], 35, 0, 2 * Math.PI);
      context.fill();
    });

    context.fillStyle = "white";
  };

  static spawn(context, availableCoords, avaiableCoordsStrings, spawnEnemy, levelSpawnedEnemis) {
    // Set available tower building spots
    if (this.hasSetAvailableCoordinates === false) {
      this.hasSetAvailableCoordinates = true;
      availableCoords = [
        [300, 500],
        [150, 300],
        [500, 500],
        [700, 500],
        [600, 300],
        [1000, 300],
        [1200, 500]
      ];
      // Also make a string version for easy comparison
      availableCoords.forEach((ele) => {
        avaiableCoordsStrings.push(ele[0] + "," + ele[1]);
      });
    }

    // Todo remove with play button
    if (this.enemiesHaveBeenSpawned === false) {
      this.enemiesHaveBeenSpawned = true;
      var i;
      for (i = 0; i < 15; i++) {
        var random = Math.floor(Math.random() * 50) + 1;
        // TODO: FIX THIS so it works in GameWorld.js
        spawnEnemy(
          i,
          i / 3,
          new Enemy(context, this.start.x - random, this.start.y, 64 * 2, 0, 1),
        );
      }
    }
  }
}
