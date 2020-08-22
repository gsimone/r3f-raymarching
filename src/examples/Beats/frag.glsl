// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float BPM;
uniform vec3 color;
uniform float divisions;

#define PI 3.14
#define PI_2 6.28

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand (vec2 n)
{ 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main()
{
    vec4 final = vec4(vec3(0.0), 1.0);
    
    // Aspect ratio corrected uv
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    uv.x *= u_resolution.x/u_resolution.y;
    
    // Beat?
    float BPS = 60.0 / BPM;
    float BPS2 = BPS * 2.0;
    float beatDelta = mod(u_time, BPS) / BPS;
    float beatDelta2 = mod(u_time, BPS2) / BPS2;
    float beatIncr = 3.0 + mod(floor(u_time / BPS), 4.0);
    float beatIncr2 = 3.0 + mod(floor(u_time / BPS2), 4.0);
    
    float beatTime = u_time / BPS;
    float powerBeat = pow(1.0 - beatDelta, 1.4);
    
    // Rad BG
    float radRand = rand(vec2(floor(uv.x * divisions) / divisions, beatIncr));
    vec2 raduv = vec2(uv.x, min(uv.y + radRand * 0.5, 1.0));
    
    float radIntensity = pow(min(powerBeat + radRand * 0.3, 1.0), 2.0) * 0.52 + abs(sin(beatTime * 10.0 + radRand * 42.0)) * 0.1;
    float radDelta = 1.0 - abs(radIntensity - raduv.y) * 2.0;
    float radPercent = max(round(sin(raduv.y * 128.0) * pow(radDelta, 2.0)) * pow(max(radDelta, 0.0), 6.0), smoothstep(radIntensity, radIntensity - 0.001, raduv.y));
    
    vec3 radColour = mix(vec3(0.0), vec3(color) * (1.0 + radRand * 0.1), radPercent);
    final.xyz += radColour;
    
    // Output to screen
    final.xyz = clamp(final.xyz, 0.0, 1.0);
    final.a = 1.0;
    gl_FragColor = final;
}
