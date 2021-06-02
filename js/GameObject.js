class GameObject {
  constructor(context, x, y, vx, vy) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.distanceX = 0;
    this.distanceY = 0;
    this.isColliding = false;
    this.radius = 10;
  }
}
