class Enemy extends GameObject {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    this.id = Math.random().toString(36).substr(2, 9);
    this.health = 1;
    this.level = 0;
    this.speed = 1;

    // Grid box dimensions
    this.width = 64;
    this.height = 36;
    // Progress
    this.pixelsTravelled = 0;

    this.color = "#DB5461";

    this.debug = false;
  }

  draw() {
    if (this.debug) this.debugging();

    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  down = () => {
    this.vx = 0;
    this.vy = this.height * 3;
  };

  right = () => {
    this.vx = this.width * 2;
    this.vy = 0;
  };

  up = () => {
    this.vx = 0;
    this.vy = -(this.height * 3);
  };

  debugging() {
    this.context.font = "36px Verdana";

    this.context.fillText(this.health, this.x, this.y + 30);

    this.context.fillText(
      "x" + Math.floor(this.distanceX),
      this.x + 50,
      this.y + 50
    );
    this.context.fillText(
      "y" + Math.floor(this.distanceY),
      this.x + 50,
      this.y + 70
    );
    this.context.fillText(
      "p " + this.pixelsTravelled,
      this.x + 50,
      this.y + 110
    );
  }

  update(secondsPassed) {
    var distanceX = this.vx * secondsPassed;
    var distanceY = this.vy * secondsPassed;

    this.distanceX += distanceX;
    this.distanceY += distanceY;

    this.pixelsTravelled +=
      this.speed * (Math.abs(distanceX) + Math.abs(distanceY));

    if (this.x < 0) this.pixelsTravelled = 0;

    //Move with set velocity
    this.x += this.speed * distanceX;
    this.y += this.speed * distanceY;

    // Gates [pixels travelled, direction after gate]
    // When gate has been executed, pixels will be set to 0
    var gates = [
      [200, this.down],
      [400, this.right],
      [800, this.up],
      [1000, this.right]
    ];

    // Check if gate has been reached
    gates.forEach((gate) => {
      if (this.pixelsTravelled > gate[0]) {
        if (gate[0] !== 0) {
          gate[1]();
          gate[0] = 0;
        }
      }
    });

    // Edge of map detection
    if (this.x >= 1600) {
      this.vx = 0;
      this.yx = 0;
    }
  }
}
