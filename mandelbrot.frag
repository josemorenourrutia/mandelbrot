// These are necessary definitions that let you graphics card know how to render the shader
// #ifdef GL_ES
precision mediump float;
 
// #endif
uniform vec2 u_resolution;
uniform vec4 Area;
uniform float angle;
uniform vec3 newColor;
uniform float smoothM;

vec2 rotate2D (vec2 _st, vec2 pivot, float _angle) {
    _st -= pivot;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += pivot;
    return _st;
}

float smoothMandelbrot( vec2 c )
{
    const float B2 = 256.0 * 256.0;
    vec2 z  = vec2(0.0);
    for( float i = 0.; i < 512.; i++ )
    {
        z = vec2( z.x * z.x - z.y * z.y, 2.0 * z.x * z.y ) + c;
        if( dot(z,z) > B2 ) return i - log2(log2(dot(z,z))) + 4.0;
    }
    return 0.0;    
}

float mandelbrot( vec2 c )
{
    vec2 z  = vec2(0.0);
    for(float iter = 0.0; iter < 512.0; iter++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if ( dot( z, z ) > 4.0) {
            return iter;
        };
    }
    return 0.0;
}


void main() {
    // In shaders, the RGB color spectrum goes from 0 - 1 instead of 0 - 255

    // gl_FragColor is a built in shader variable, and you .frag file must contain it
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy ) / u_resolution.x;
    vec2 c = Area.xy + uv * Area.zw;
    c = rotate2D(c, Area.xy, angle);

    float l = smoothM < 1. ? mandelbrot(c) : smoothMandelbrot(c);
    vec3 color = 0.5 + 0.4 * cos( 3.0 + l * 0.15 + newColor);
    // We are setting the vec3 color into a new vec4, with an transparency of 1 (no opacity)
    gl_FragColor = vec4(color, 1.0);
}
