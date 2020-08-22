#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform sampler2D text;
uniform vec2 u_resolution;
uniform float u_time;

#pragma glslify: rotate = require(../../common/rotate)

// @akella
float SineCrazy(vec3 p) {
  return 1. - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.; 
}

// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float scene(vec3 p) {

  vec3 p1 = rotate(p, vec3(0.,1.,0.), u_time * 6.283185);
  vec3 p2 = rotate(p, vec3(1.), -u_time  * 6.283185);
  
  float scale  = 6.;

  float sinecc = (0.836 - SineCrazy((p2 + vec3(0., .2, 0.)) * scale)) / scale;

  return max(
      sdOctahedron(p1, 0.756),
      sinecc
  );
}

vec3 getColorAmount(vec3 p) {
  float amount = clamp((1.5 - length(p))/2., 0., 1.);
  vec3 color = 0.588 + 0.708 * cos(6.28319 * (vec3(0.009,0.200,0.016) + amount * vec3(0.109,1.000,0.571)));

  return color * amount;
}

void main()	{
    float x = u_resolution.x / u_resolution.y;
    
    vec2 uv = vUv * vec2(x, 1.) + vec2((1. - x)/2., 0.);
  
    vec3 camPos = vec3(0, 0, 2.);
    vec2 p = uv - vec2(0.5);
    vec3 ray = normalize(vec3(p, -1.));
    vec3 rayPos = camPos;
    float curDist = 0.;
    // from camera to point
    float rayLength = 0.;
    vec3 light = vec3(1.,1.,1.);

    bool hit = false;


    vec3 textureColor = vec3(0.);
    textureColor = texture2D(text, vUv).rgb;
    vec3 finalColor = vec3(0.);

    for (int i = 0; i <= 64; i++) {
      curDist = scene(rayPos);
      rayLength +=  0.536 * curDist;
      rayPos = camPos + ray * rayLength;
      // if hitting the object
      if (abs(curDist) < 0.001) {
        break;
      }

      finalColor +=  (0.052 * getColorAmount(rayPos));

    }

    vec3 color = finalColor;

    if (scene(rayPos) > 0.1) {
      color = max(finalColor, textureColor);
    } 

    gl_FragColor = vec4(color, 1.);
}
