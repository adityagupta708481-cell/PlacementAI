import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

export default function DotMatrixBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let active = true;
    let renderer;
    let geometry;
    let material;
    let scene;
    let camera;
    let animationId;

    const initThree = (ThreeLib) => {
      if (!canvasRef.current || !active) return;
      const canvas = canvasRef.current;
      renderer = new ThreeLib.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);

      scene = new ThreeLib.Scene();
      camera = new ThreeLib.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new ThreeLib.Vector2(window.innerWidth * 2, window.innerHeight * 2) },
        u_opacities: { value: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1.0] },
        u_colors: { value: [
          new ThreeLib.Vector3(0.184, 0.914, 0.169), // Neon green #2fe92b (chart-1 / primary)
          new ThreeLib.Vector3(0.184, 0.914, 0.169), // Neon green #2fe92b
          new ThreeLib.Vector3(0.733, 0.796, 0.698), // Muted sage #bbcbb2 (muted-foreground)
          new ThreeLib.Vector3(1, 1, 1),              // Crisp white #ffffff
          new ThreeLib.Vector3(0.184, 0.914, 0.169), // Neon green
          new ThreeLib.Vector3(0.733, 0.796, 0.698)  // Muted sage
        ] },
        u_total_size: { value: 20.0 },
        u_dot_size: { value: 6.0 },
        u_reverse: { value: 0 }
      };

      material = new ThreeLib.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          uniform vec2 u_resolution;
          out vec2 fragCoord;
          void main() {
            gl_Position = vec4(position, 1.0);
            fragCoord = (position.xy + 1.0) * 0.5 * u_resolution;
            fragCoord.y = u_resolution.y - fragCoord.y;
          }
        `,
        fragmentShader: `
          precision mediump float;
          in vec2 fragCoord;

          uniform float u_time;
          uniform float u_opacities[10];
          uniform vec3 u_colors[6];
          uniform float u_total_size;
          uniform float u_dot_size;
          uniform vec2 u_resolution;
          uniform int u_reverse;

          out vec4 fragColor;

          float PHI = 1.61803398874989484820459;
          float random(vec2 xy) {
              return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
          }

          void main() {
              vec2 st = fragCoord.xy;
              st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
              st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

              float opacity = step(0.0, st.x) * step(0.0, st.y);

              vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

              float frequency = 5.0;
              float show_offset = random(st2);
              float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
              opacity *= u_opacities[int(rand * 10.0)];
              opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
              opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

              vec3 color = u_colors[int(show_offset * 6.0)];

              float animation_speed_factor = 3.0;
              vec2 center_grid = u_resolution / 2.0 / u_total_size;
              float dist_from_center = distance(center_grid, st2);

              float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

              float current_timing_offset = timing_offset_intro;
              opacity *= step(current_timing_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);

              fragColor = vec4(color, opacity);
              fragColor.rgb *= fragColor.a;
          }
        `,
        uniforms: uniforms,
        glslVersion: ThreeLib.GLSL3,
        blending: ThreeLib.CustomBlending,
        blendSrc: ThreeLib.SrcAlphaFactor,
        blendDst: ThreeLib.OneFactor,
        transparent: true
      });

      geometry = new ThreeLib.PlaneGeometry(2, 2);
      const mesh = new ThreeLib.Mesh(geometry, material);
      scene.add(mesh);

      const startTime = performance.now();
      const animate = () => {
        if (!active) return;
        animationId = requestAnimationFrame(animate);
        uniforms.u_time.value = (performance.now() - startTime) / 1000.0;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!renderer) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth * 2, window.innerHeight * 2);
      };
      const onVisibilityChange = () => {
        if (document.hidden) {
          if (animationId) cancelAnimationFrame(animationId);
        } else if (active) {
          animate();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      };
    };

    const threeInstance = THREE || window.THREE;
    let cleanupFn;

    if (threeInstance) {
      cleanupFn = initThree(threeInstance);
    } else {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      script.async = true;
      script.onload = () => {
        if (window.THREE && active) {
          cleanupFn = initThree(window.THREE);
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      if (cleanupFn) cleanupFn();
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) renderer.dispose();
      if (geometry) geometry.dispose();
      if (material) material.dispose();
    };
  }, []);

  return (
    <>
      {/* WebGL Dot canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none"
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: isDark
            ? "radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(7,8,11,0.92) 100%)"
            : "radial-gradient(circle at center, rgba(235,237,242,0.35) 0%, rgba(215,222,232,0.92) 100%)",
          transition: "background 0.3s ease",
          pointerEvents: "none"
        }}
      />
    </>
  );
}
