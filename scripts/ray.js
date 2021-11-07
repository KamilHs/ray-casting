class Ray {
  constructor(x, y, dir) {
    this.pos = createVector(x, y);
    this.dir = dir;
    this.collision = null;
  }

  draw() {
    if (!this.collision) return;

    push();
    strokeWeight(1);
    stroke(255);
    line(
      this.collision.x1,
      this.collision.y1,
      this.collision.x2,
      this.collision.y2
    );
    pop();
  }

  update(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  cast(mirror, isAdding) {
    if (this.collision && isAdding) return;

    const x1 = mirror.x1;
    const y1 = mirror.y1;
    const x2 = mirror.x2;
    const y2 = mirror.y2;

    let mirrorDelta = createVector(x2 - x1, y2 - y1).normalize();
    let normal = createVector(-mirrorDelta.y, mirrorDelta.x);
    let incidence;

    let x3;
    let y3;
    let x4;
    let y4;

    if (!this.collision || !isAdding) {
      x3 = this.pos.x;
      y3 = this.pos.y;
      x4 = this.pos.x + this.dir.x;
      y4 = this.pos.y + this.dir.y;
      incidence = p5.Vector.mult(this.dir, -1);
    } else {
      let c = this.collisions[this.collisions.length - 1];
      x3 = c.x2;
      y3 = c.y2;
      x4 = c.x2 + c.dir.x;
      y4 = c.y2 + c.dir.y;
      incidence = p5.Vector.mult(c.dir, -1);
    }

    const dot = incidence.dot(normal);
    const dir = createVector(
      2 * normal.x * dot - incidence.x,
      2 * normal.y * dot - incidence.y
    );

    const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (d == 0) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));

      return {
        pt: pt,
        collision: {
          x1: x3,
          y1: y3,
          x2: x1 + t * (x2 - x1),
          y2: y1 + t * (y2 - y1),
          dir: dir,
          mirror: mirror,
        },
        dist: dist(x3, y3, pt.x, pt.y),
      };
    }
  }

  check() {
    if (this.collision) {
      const x1 = this.collision.x1;
      const y1 = this.collision.y1;
      const x2 = this.collision.x2;
      const y2 = this.collision.y2;

      const data = this.cast(this.collision.mirror, false);
      const pt = data?.collision;

      if (!pt || pt.x1 != x1 || pt.x2 != x2 || pt.y1 != y1 || pt.y2 != y2) {
        this.collision = null;
      }
    }
  }
}
