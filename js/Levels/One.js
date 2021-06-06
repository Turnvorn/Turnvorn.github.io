// TODO: Remove from GameWorld and use these methods instead
// Remove this.context etc. and introduce input variables instead

class One {
  static staticProperty = "someValue";

  static staticMethod() {
    return "static method has been called.";
  }

  drawLevel = () => {
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

  spawnLevel() {
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
    // Todo remove with play button
    if (this.towers.length > 0) {
      var i;
      for (i = 0; i < 15; i++) {
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
    } else {
      this.levelSeconds = 0; // Round not begun
    }
  }
}
