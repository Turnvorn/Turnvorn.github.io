class Helpers {
  static removeItemOnce = (arr, value) => {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  static rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
      return false;
    }

    return true;
  }

  static circleIntersect(obj1, obj2) {
    var a = obj1.x - obj2.x;
    var b = obj1.y - obj2.y;
    var c = Math.sqrt(a * a + b * b);

    if (c > obj1.radius + obj2.radius) return false;

    return true;
  }

  // Grid for debugging
  createGrid(context) {
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
      context.beginPath(); // Start a new path
      context.moveTo(currentX, 0); // Move the pen
      context.lineTo(currentX, height); // Draw a line
      context.stroke(); // Render the path
    }
    for (var i = 0; i < 18; i++) {
      currentY += 50;

      // Horizontal lines
      context.beginPath(); // Start a new path
      context.moveTo(0, currentY); // Move the pen
      context.lineTo(width, currentY); // Draw a line
      context.stroke(); // Render the path
    }
  }
}
