// a shader variable
let theShader;
let shaderGraphics;
let gl, canvas, textSrc;
let testText = 'Positive / Negative';
let scale = 4;
let scaleX = scale;
let scaleY = scale;
let Area = [0, 0, 4, 4];
let angle = 0;

let font;
function preload () {
  // load the shader
  // theShader = loadShader('shader.vert', 'shader.frag');
  // font = loadFont('BigCaslon.otf');
}

function setup () {
  // shaders require WEBGL mode to work
  createCanvas( 200, 200, WEBGL );//windowWidth, windowHeight, WEBGL);
  pixelDensity( 1 );
  noStroke();

  // fill('black');
  // textAlign(CENTER)
  // textSize(36);
  // shaderLayer = createGraphics(width, height, WEBGL);
  // shaderLayer.noStroke();
  textSrc = createGraphics( width, height, WEBGL );
  textSrc.pixelDensity( 1 );

  // shaderGraphics = createGraphics(width, height, WEBGL);
  // shaderGraphics.pixelDensity(1);
  // shaderGraphics.noStroke();

  let aspect = width / height;

  if ( aspect > 1 )
    scaleY /= aspect;
  else
    scaleX *= aspect;
  Area = [0, 0, scaleX, scaleY];
}

function draw () {
  background( 51 );
  textSrc.textFont( font, 10 );
  textSrc.background( 0 );
  textSrc.textAlign( CENTER, CENTER );
  textSrc.text( testText, 0, 0 );//-width / 2, -height / 2);//, width * 2, height * 2);
  image( textSrc, 0, 0, width, height );
}

function pressed () {
  if ( keyIsDown( unchar( 'A' ) ) ) {
    Area[2] *= 0.99;
    Area[3] *= 0.99;
  }
  if ( keyIsDown( unchar( 'S' ) ) ) {
    Area[2] *= 1.01;
    Area[3] *= 1.01;
  }
  if ( keyIsDown( unchar( 'Z' ) ) ) {
    angle += 0.01;
  }
  if ( keyIsDown( unchar( 'X' ) ) ) {
    angle -= 0.01;
  }

  const s = Math.sin( angle );
  const c = Math.cos( angle );
  let dir = [0.01 * Area[2] * c, 0.01 * Area[3] * s];

  if ( keyIsDown( LEFT_ARROW ) ) {
    // Area[0] += 0.01 * scaleX;
    Area[0] -= -dir[0];
    Area[1] -= dir[1];
  }

  if ( keyIsDown( RIGHT_ARROW ) ) {
    Area[0] += -dir[0];
    Area[1] += dir[1];
  }

  if ( keyIsDown( UP_ARROW ) ) {
    Area[0] -= dir[1];
    Area[1] -= dir[0];
  }

  if ( keyIsDown( DOWN_ARROW ) ) {
    Area[0] += dir[1];
    Area[1] += dir[0];
  }
}
function windowResized () {
  resizeCanvas( windowWidth, windowHeight );
}
