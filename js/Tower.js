class Tower extends GameObject {
  constructor(context, x, y, vx, vy) {
    super(context, x, y, vx, vy);

    this.id = Math.random().toString(36).substr(2, 9);
    this.radius = 100;
    this.level = 0;
    this.enemies = []; // Enemies in range
    this.radius = 150;
    this.speed = 1; // Game speed

    this.damage = 1; // Damage per shot
    this.shots = 2; // Shots in the mag
    this.delay = 1; // Seconds between shots
    this.timeLastShot = Date.now();

    this.debug = false;
  }

  draw() {
    if (this.debug) this.debugging();

    // Bullets in the air
    if (this.enemies.length > 0) {
      // Dashed line
      this.context.beginPath();
      this.context.setLineDash([5, 15]);
      this.context.lineWidth = 2;
      this.context.strokeStyle = "#7b0000";
      this.context.moveTo(this.x, this.y);
      this.context.lineTo(this.enemies[0].x, this.enemies[0].y);
      this.context.stroke();
    }
    this.context.beginPath();

    this.context.fillStyle = "#FDE74C";
    this.context.arc(this.x, this.y, this.radius / 10, 0, 2 * Math.PI);
    this.context.fill();

    this.context.beginPath();

    if (this.enemies.length > 0) {
      this.context.fillStyle = "rgba(255, 0, 0, 0.2)";
    } else {
      this.context.fillStyle = "rgba(0, 0, 0, 0.05)";
    }
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  debugging = () => {
    this.context.fillStyle = "#ff8080";
    this.context.fillText(this.enemies, this.x + 50, this.y + 70);
    this.context.fillText(
      Date.now() - this.timeLastShot,
      this.x + 50,
      this.y + 80
    );
  };

  // Sort enemies by distance travelled
  // so we can aim at the one in the front
  sort() {
    function compare(a, b) {
      if (a.pixelsTravelled < b.pixelsTravelled) {
        return 1;
      }
      if (a.pixelsTravelled > b.pixelsTravelled) {
        return -1;
      }
      return 0;
    }

    this.enemies.sort(compare);
  }

  update(secondsPassed) {
    //Move with set velocity
    this.x += this.vx * secondsPassed;
    this.y += this.vy * secondsPassed;

    // sort enemies
    this.sort();

    // Damage
    var now = Date.now();

    if (this.enemies.length > 0) {
      if (now - this.delay * 1000 > this.timeLastShot) {
        this.timeLastShot = now;
        if (this.enemies[0]) {
          this.enemies[0].health -= this.damage;
        }
      }
    } else {
      // Delay before taking the first shot
      this.timeLastShot = now;
    }
  }
}
