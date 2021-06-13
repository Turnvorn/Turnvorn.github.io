class Mouse {
  static staticProperty = "someValue";
  static debugging = false;
  static staticMethod() {
    return "static method has been called.";
  }

  static drawInventory = (context, coins, wave) => {
    context.fillStyle = "#fff";
    context.font = "100px Verdana";
    context.fillText(coins + "$", 1600 / 2 - 100, 828 + 36);

    context.fillStyle = "#ccc";
    context.font = "50px Verdana";
    context.fillText("WAVE " + wave, 1600 / 2 - 80, 750);
    context.beginPath();

    context.fillStyle = "#FDE74C";
    context.font = "25px Verdana";
    context.fillText("DART TOWER 100$", 50, 828 + 36);
    context.fillStyle = "#FDE74C";
    context.arc(150, 800, 20, 0, 2 * Math.PI);
    context.fill();
  };

  static getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var mouseX =
      ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
    var mouseY =
      ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
    return {
      x: mouseX,
      y: mouseY
    };
  }

  static drawCursor(context, x, y, selection = null) {
    var snap = this.snapToGrid(x, y);

    if (this.debugging) {
      context.fillText(snap.x + "," + snap.y, snap.x, snap.y + 20);
    }

    if (selection === "dart") {
      context.beginPath();

      context.fillStyle = "rgba(0, 0, 0, 0.1)";
      context.arc(snap.x, snap.y, 150, 0, 2 * Math.PI);
      context.fill();
      context.beginPath();
      context.fillStyle = "#FDE74C";
      context.arc(snap.x, snap.y, 20, 0, 2 * Math.PI);
      context.fill();
    }
  }

  static snapToGrid(x, y) {
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
}
