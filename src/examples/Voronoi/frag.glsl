// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float multi;
uniform float divisions;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(0.);

    st *= divisions;

    // Tile the space by getting the int and fract values
    vec2 i_st = floor(st); // coordinates of the tile
    vec2 f_st = fract(st);  // pixel in the tile


    float m_dist = 1.;

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {

            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // random point inside the neighbor
            vec2 point = random2(i_st + neighbor);

            // animates the point position
            point = 0.5 + 0.5*sin(u_time + 6.2831*point);
            
            // vector bewtween our pixel and the point
            vec2 diff = neighbor + point - f_st;

            // get the lenght ofht prev vector to get the distance
            float dist = length(diff);

            // keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }

    
    color += m_dist * multi;
    // color.r += step(.99, f_st.x) + step(.99, f_st.y);

    gl_FragColor = vec4( color, 1.0 );
} 
