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
}
