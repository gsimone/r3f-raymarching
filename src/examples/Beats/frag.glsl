#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform float BPM;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main()
{
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    // Beat?
    float BPS = 60.0 / BPM;
    float beatDelta = mod(u_time, BPS) / BPS;
    float powerBeat = pow(1.0 - beatDelta, 1.4);
    
    // Rad BG
    float radIntensity = pow(min(powerBeat, 1.0), 2.0);
    float radius = (1. - radIntensity) * .25;

    vec2 center = vec2(u_resolution.x/u_resolution.y/2., .5);
    
    vec3 color = vec3(circle(st - center, radius), 0., 0.);

    gl_FragColor = vec4(color, .1);
}
