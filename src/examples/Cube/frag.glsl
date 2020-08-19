varying vec2 vUv;
uniform vec2 resolution;
uniform float time;

#pragma glslify: rotate = require(../../common/rotate)

float sdSphere(vec3 p, float radius) {
    return length(p) - radius;
}
float SineCrazy(vec3 p) {
    return 1. - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

float scene(vec3 p) {
    vec3 p1 = rotate(p, vec3(1., 1., 1.), time);

    return opSmoothUnion(sdSphere(p1, .25 + .5 * sin(time)), sdBox(p1, vec3(.4)), .4);
}

vec3 getColorAmount(vec3 p) {
    float amount = clamp(1.5 - length(p) / 2., 0., 1.);
    vec3 col = pal(amount, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 0.5), vec3(0.8, 0.90, 0.30));
    return col * amount;
}

void main() {
    float x = resolution.x / resolution.y;

    vec2 uv = vUv * vec2(x, 1.) + vec2((1. - x) / 2., 0.);

    vec3 camPos = vec3(0, 0, 2.);
    vec2 p = uv - vec2(0.5);
    vec3 ray = normalize(vec3(p, -1.));
    vec3 rayPos = camPos;
    float curDist = 0.;
    // from camera to point
    float rayLength = 0.;
    vec3 color = vec3(0.);
    vec3 light = vec3(1., 1., 1.);
    for (int i = 0; i <= 128; i++) {
        curDist = scene(rayPos);
        rayLength += 0.6 * curDist;
        rayPos = camPos + ray * rayLength;
        // if hitting the object
        if (abs(curDist) < 0.01) {
            break;
        }
        color += 0.01 * getColorAmount(rayPos);
    }
    gl_FragColor = vec4(color, 1.);
}
