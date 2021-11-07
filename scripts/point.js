class Point {
  constructor(x, y, raysCount) {
    this.x = x;
    this.y = y;
    this.rays = [];

    this.initRays(raysCount);
  }

  initRays(raysCount) {
    let delta = TWO_PI / raysCount;

    for (let i = 0; i < raysCount; i++) {
      const angle = delta * i;
      this.rays.push(
        new Ray(this.x, this.y, createVector(Math.sin(angle), Math.cos(angle)))
      );
    }
  }

  update(x, y) {
    this.x = x;
    this.y = y;
    this.rays.forEach((ray) => ray.update(x, y));
  }
}
