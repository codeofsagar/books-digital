'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { Canvas, useFrame, useThree, type RootState, ThreeElement } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      shaderMaterial: ThreeElement<typeof THREE.ShaderMaterial>;
    }
  }
}

// Shader-based animated background — repainted with the user-supplied palette:
//   navy  #001428  (deep base)
//   forest #4A5C44 (the dominant green)
//   khaki  #D9CC8C (gold/cream highlight)
//   cream  #FFE1D0 (rare hot spot)
//
// The dominant two tones the canvas reads as are black + forest green per
// the brief; khaki and cream live inside the noise field as warmer pools.

// Perlin noise helper — unchanged from the original implementation
const cnoise21 = `
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float cnoise21(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}
`;

const vertexShader = `
varying vec2 v_uv;
void main() {
  v_uv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// Palette baked into the shader as vec3 (0-1) values:
//   forest green (#4A5C44)  →  vec3(0.290, 0.361, 0.267)
//   khaki gold   (#D9CC8C)  →  vec3(0.851, 0.800, 0.549)
//   navy         (#001428)  →  vec3(0.000, 0.078, 0.157)
const fragmentShader = `
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_aspect;
varying vec2 v_uv;

${cnoise21}

float random(vec2 p) {
  vec2 k1 = vec2(23.14069263277926, 2.665144142690225);
  return fract(cos(dot(p, k1)) * 12345.6789);
}

// Two-tone canvas: BLACK + DARK FOREST. Lifted from the previous super-dim
// pass so the green reads properly without going lime.
const vec3 black  = vec3(0.0);
const vec3 forest = vec3(0.122, 0.235, 0.137);  // #1F3C23 — visible dark forest

void main() {
  vec2 uv = v_uv;
  uv.x *= u_aspect;

  vec2 mouseAspect = u_mouse;
  mouseAspect.x *= u_aspect;

  vec2 seed = (uv * vec2(0.5, 1.0)) + (mouseAspect * 0.8) + vec2(0.0, u_time * 0.05);
  float n = cnoise21(seed) + length(u_mouse) * 0.5;
  float ml = pow(length(u_mouse), 2.5) * 0.15;

  vec3 color = black;

  // Broader noise window so the green pools cover more of the canvas,
  // but still collapse back to black past the peaks — keeps the canvas
  // black-dominant without going pitch-dark.
  float greenBand = smoothstep(0.22 + ml, 0.48 + ml, n) *
                    (1.0 - smoothstep(0.62 + ml, 0.85 + ml, n));
  color = mix(color, forest, greenBand);

  // Very faint grain
  vec2 uvrandom = v_uv;
  uvrandom.y *= random(vec2(uvrandom.y, u_time));
  color.rgb += random(uvrandom) * 0.028;

  // Soft black behind the nav strip, but not pitch-black — let some green
  // bleed through the top so the strip doesn't look like a separate band
  float topFade = smoothstep(0.92, 1.0, v_uv.y) * 0.7;
  color = mix(color, black, topFade);

  gl_FragColor = vec4(color, 1.0);
}
`;

function GradientPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_aspect: { value: viewport.width / viewport.height },
    }),
    // Init only once — viewport handled in useEffect below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state: RootState) => {
    const m = materialRef.current;
    if (!m) return;
    m.uniforms.u_time.value = state.clock.getElapsedTime();
    const targetX = (state.pointer.x + 1) * 0.5;
    const targetY = (state.pointer.y + 1) * 0.5;
    m.uniforms.u_mouse.value.lerp(new THREE.Vector2(targetX, targetY), 0.05);
  });

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_aspect.value = viewport.width / viewport.height;
    }
  }, [viewport]);

  return (
    <Plane args={[2, 2]}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </Plane>
  );
}

export function Background() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        pointerEvents: 'none',
        background: '#000',
      }}
    >
      <Canvas
        frameloop="always"
        orthographic
        camera={{ zoom: 1, position: [0, 0, 100] }}
        resize={{ scroll: false }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <GradientPlane />
      </Canvas>
    </div>
  );
}
