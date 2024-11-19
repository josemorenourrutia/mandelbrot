// a shader variable
let theShader, shaderTexture;

let scale = 4;
let Area = [0, 0, scale, scale], smoothArea = [];
let center = [0, 0, 0, 0];
let angle = 0, smoothAngle = 0;
let aspect;

let div, inc = 0.01;
let newColor = [0., 0.6, 1.0];

let myPicker, checkbox;
function preload() { theShader = loadShader('mandelbrot.vert', 'mandelbrot.frag'); }

function lerpN(a, b, t, p) {
  let norm = 0;
  for (let i = 0; i < a.length; i++) {
    norm += (b[i] - a[i]) * (b[i] - a[i]);
    p[i] = a[i] + t * (b[i] - a[i]);
  }
  return norm;
}

function hexToRgb(hex) {

  const bigint = parseInt(hex.replace('#', ''), 16);

  return [
    ((bigint >> 16) & 255) / 255,  // r
    ((bigint >> 8) & 255) / 255, // g
    (bigint & 255) / 255 // b
  ]
}

function reset() {
  newColor = [0., 0.6, 1.0];
  angle = smoothAngle = 0;
  scale = 4;
  Area = [0, 0, scale, scale];
  aspect = width / height;
  if (aspect > 1) Area[3] /= aspect; else Area[2] *= aspect;

  for (let i = 0; i < Area.length; i++) { smoothArea[i] = Area[i]; }
}

function setup() {
  const k = 100;
  // shaders require WEBGL mode to work
  const canvas = createCanvas(k * 6, k * 5, WEBGL);//windowWidth, windowHeight, WEBGL);
  canvas.elt.oncontextmenu = () => false;

  pixelDensity(1);
  noStroke();

  shaderTexture = createGraphics(k * 6, k * 5, WEBGL);
  shaderTexture.shader(theShader);
  texture(shaderTexture);

  div = createDiv('');
  div.style('font-size', '16px');
  div.style('color', 'white');
  div.position(10, 0);

  labelPicker = createDiv('SmoothColor');
  labelPicker.style('font-size', '16px');
  labelPicker.position(130, 510);

  myPicker = createColorPicker(`rgba(${newColor[0] * 255}, ${newColor[1] * 255}, ${newColor[2] * 255}, 255)`);
  myPicker
    .position(10, 510)
    .input(({ target }) => { newColor = hexToRgb(target.value); shaderDraw() });

  checkbox = createCheckbox()
    .position(100, 510)
    .changed(shaderDraw);

  button = createButton('Reset', 'red')
    .position(300, 510)
    .mousePressed(() => { reset(); shaderDraw() });

  aspect = width / height;
  if (aspect > 1) Area[3] /= aspect; else Area[2] *= aspect;

  for (let i = 0; i < Area.length; i++) { smoothArea[i] = Area[i]; }
  shaderDraw();
  setInterval(function () { div.html(frameRate().toFixed(0)); }, 500);
}

function shaderDraw() {

  theShader.setUniform('smoothM', checkbox.checked())
  theShader.setUniform('newColor', newColor);
  theShader.setUniform('u_resolution', [width.toPrecision(36), height.toPrecision(36)]);
  theShader.setUniform('Area', [smoothArea[0].toPrecision(36), smoothArea[1].toPrecision(36), smoothArea[2].toPrecision(36), smoothArea[3].toPrecision(36)]);
  theShader.setUniform('angle', smoothAngle.toPrecision(36));
  theShader.setUniform('aspect', 1);
  shaderTexture.rect(0, 0, width, height);
  translate(-width / 2, -height / 2);
  rect(0, 0, width, height);
  translate(width / 2, height / 2);
}

function draw() {

  pressed();

  let normArea = lerpN(smoothArea, Area, 0.03, smoothArea);
  smoothAngle = lerp(smoothAngle, angle, 0.03);
  let normAngle = Math.abs(smoothAngle - angle);

  if (normArea + normAngle > 1.e-5 * Area[2])
    shaderDraw();
  else if (normArea + normAngle > 0) {
    for (let i = 0; i < 4; i++) { smoothArea[i] = Area[i]; }
    smoothAngle = angle
    shaderDraw();
  }

  // fill(255, 0, 0);
  // stroke(255);
  // line(-width / 2, 0, width / 2, 0); // Eje X
  // line(0, height / 2, 0, -height / 2); // Eje Y
}

function pressed() {
  inc = 0.01;//sliderInc.value();
  const inc1 = 1 - inc;
  const inc2 = 1 + inc;
  if (keyIsDown(unchar('A'))) { Area[2] *= inc1; Area[3] *= inc1; scale *= inc1; }

  if (keyIsDown(unchar('S'))) { Area[2] *= inc2; Area[3] *= inc2; scale *= inc2; }

  if (keyIsDown(unchar('Z'))) { angle += inc; }

  if (keyIsDown(unchar('X'))) { angle -= inc; }

  const dir = [inc * scale * Math.cos(-angle), inc * scale * Math.sin(-angle)];

  if (keyIsDown(RIGHT_ARROW)) { Area[0] += dir[0]; Area[1] += dir[1]; }

  if (keyIsDown(LEFT_ARROW)) { Area[0] += -dir[0]; Area[1] += -dir[1]; }

  if (keyIsDown(DOWN_ARROW)) { Area[0] += dir[1]; Area[1] += -dir[0]; }

  if (keyIsDown(UP_ARROW)) { Area[0] += -dir[1]; Area[1] += dir[0]; }
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function mousePressed(e) {

  if (e.clientX > width || e.clientY > height) return;

  let x = (e.clientX - 0.5 * width) / width * Area[2];
  let y = -(e.clientY - 0.5 * height) / height * Area[3];
  if (aspect < 1) x *= aspect; else y /= aspect;

  const s = Math.sin(-angle), c = Math.cos(-angle);
  const center = [c * x - s * y, s * x + c * y];

  if (mouseButton === LEFT) {
    const factorScale = 0.5;
    const factorScale2 = 1 - factorScale;
    Area[2] *= factorScale2;
    Area[3] *= factorScale2;
    scale *= factorScale2;

    Area[0] += center[0] * factorScale;
    Area[1] += center[1] * factorScale;
  }
  if (mouseButton === RIGHT) {
    Area[0] += center[0];
    Area[1] += center[1];
  }
}

function mouseWheel(event) {
  const wheelInc = inc * event.delta / 10 + 1;

  Area[2] *= wheelInc;
  Area[3] *= wheelInc;
  scale *= wheelInc;

}