let point = null;
const mirrors = [];
const RAYS = 400;
const MAX_MIRRORS = 30;
const MIN_MIRRORS = 20;
const MIN_MIRROR_WIDTH = 100;
const MAX_MIRROR_WIDTH = 400;

function setup() {
  createCanvas(windowWidth, windowHeight);
  point = new Point(200, 200, RAYS);
  mirrors.push(
    new Mirror(0, 0, windowWidth, 0),
    new Mirror(0, windowHeight, windowWidth, windowHeight),
    new Mirror(0, 0, 0, windowHeight),
    new Mirror(windowWidth, 0, windowWidth, windowHeight)
  );

  const mirrorsCount =
    Math.floor(Math.random() * (MAX_MIRRORS - MIN_MIRRORS)) + MIN_MIRRORS;

  for (let i = 0; i < mirrorsCount; i++) {
    const x1 = Math.floor(Math.random() * windowWidth);
    const y1 = Math.floor(Math.random() * windowHeight);
    const w =
      Math.floor(Math.random() * (MAX_MIRROR_WIDTH - MIN_MIRROR_WIDTH)) +
      MIN_MIRROR_WIDTH;

    const angle = Math.random() * TWO_PI;
    const x2 = x1 + w * Math.sin(angle);
    const y2 = y1 + w * Math.cos(angle);

    mirrors.push(new Mirror(x1, y1, x2, y2));
  }
}

function draw() {
  background(0);

  mirrors.forEach((mirror) => mirror.draw());
  point.rays.forEach((ray) => {
    let closest = null;
    let record = Number.MAX_SAFE_INTEGER;

    mirrors.forEach((mirror) => {
      const data = ray.cast(mirror, true);

      if (data && data.dist < record) {
        record = data.dist;
        closest = data;
      }
    });

    if (closest) {
      ray.collision = closest.collision;
    }

    ray.draw();
    ray.check();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved() {
  point.update(mouseX, mouseY);
}
