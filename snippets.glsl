// CENTER UVS
vec2 uv = (gl_FragCoord.xy/min(u_resolution.x,u_resolution.y))
              -vec2(fract(max(u_resolution.x,u_resolution.y)/min(u_resolution.x,u_resolution.y))/2.0,0.0)
              -0.5;
