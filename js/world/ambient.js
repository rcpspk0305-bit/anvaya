/**
 * AmbientEnvironment — the living marble ground of the whole site.
 *  - A WebGL fragment shader paints slow, domain-warped mineral flows in the artwork's
 *    teal / burgundy / gold palette. It renders at reduced resolution (marble is soft),
 *    caps at ~30 fps and stops completely in reduced-motion mode.
 *  - A light 2D canvas carries sparse metallic dust.
 *  - Without WebGL, CSS falls back to a blurred, darkened crop of the official artwork.
 */
(function (A) {
  'use strict';
  const { clamp, lerp, pointer } = A.util;
  const html = document.documentElement;

  const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FRAG = (octaves) => `
precision mediump float;
uniform vec2 uRes;
uniform float uTime, uLight, uScroll, uMood, uFlare, uVeil;
uniform vec2 uPointer, uFocus;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<${octaves};i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 fp=p;
  p+=uPointer*.035;
  p.y+=uScroll;
  float t=uTime*.012;
  vec2 q=vec2(fbm(p*1.25+vec2(0.,t)),fbm(p*1.25+vec2(5.2,1.3-t)));
  vec2 r=vec2(fbm(p*1.25+3.4*q+vec2(1.7,9.2)+t*.7),fbm(p*1.25+3.4*q+vec2(8.3,2.8)-t*.5));
  float f=fbm(p*1.1+2.8*r);
  // diagonal mineral bands, as in the artwork (top-right to bottom-left)
  float band=sin((p.x*1.3-p.y*2.1)*2.2+f*7.0+uMood*1.4+t*1.6);
  vec3 obs=vec3(.024,.07,.072);
  vec3 teal=vec3(.09,.29,.28);
  vec3 aqua=vec3(.45,.68,.63);
  vec3 burg=vec3(.33,.09,.17);
  vec3 ruby=vec3(.62,.27,.30);
  vec3 gold=vec3(.86,.74,.49);
  vec3 cream=vec3(.80,.72,.56);
  float side=smoothstep(-.45,.45,band+uMood*.35);
  vec3 col=mix(burg,teal,side);
  // mineral streaks running along each band
  float streak=fbm(vec2(p.x*2.6-p.y*4.2,p.x*.8+p.y*1.4)*1.6+r*2.2);
  col=mix(col,mix(ruby,aqua,side),smoothstep(.42,.82,streak)*.6);
  col=mix(col,cream,smoothstep(.7,.95,streak)*smoothstep(.55,.95,abs(band))*.3);
  // dark pockets between flows
  col=mix(obs,col,smoothstep(.16,.6,f)*.88+.12);
  // gold veins along the band boundaries, broken by fine grit
  float edge=abs(band);
  float w=.055+.06*noise(p*9.+r*3.);
  float grit=smoothstep(.5,.95,noise(p*46.+r*9.));
  float vein=(1.-smoothstep(0.,w,edge));
  col+=gold*vein*(.28+.75*grit);
  col+=cream*vein*grit*.18;
  // scattered metallic flecks inside the stone
  col+=gold*smoothstep(.93,1.,noise(p*80.+r*20.))*smoothstep(.45,.7,f)*.45;
  // soft directional light + focus glow; vignette keeps the centre calm for text
  float d=length(fp-uFocus);
  float light=uLight*(.62+.6*smoothstep(1.7,0.,length(fp-vec2(-.55,.6))))+uLight*.3*smoothstep(.9,0.,d);
  col*=light;
  col*=smoothstep(1.75,.2,length(fp*vec2(.82,1.02)));
  // transition flare: gold light that disperses into teal and burgundy
  col+=uFlare*(gold*smoothstep(.9,0.,d)*1.1+mix(burg,teal,side)*.6);
  col=mix(col,obs*.6,uVeil);
  gl_FragColor=vec4(col,1.);
}`;

  const state = {
    light: 0, lightTarget: 0.85,
    mood: 0, moodTarget: 0,
    flare: 0,
    veil: 0, veilTarget: 0,
    focus: [0, 0.05],
    scroll: 0
  };

  let gl, prog, canvas, uni = {}, lastRender = -1, needsStatic = true, ok = false, scale = 0.5;

  function initGL() {
    canvas = document.getElementById('world-marble');
    if (!canvas) return false;
    try {
      gl = canvas.getContext('webgl', { antialias: false, depth: false, alpha: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
    } catch (e) { gl = null; }
    if (!gl) return false;
    const small = A.motion.isSmall() || A.motion.lowPower;
    scale = small ? 0.38 : 0.5;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG(small ? 4 : 5)));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (err) {
      console.warn('[anvaya] marble shader unavailable, using static fallback', err);
      return false;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uRes', 'uTime', 'uLight', 'uScroll', 'uMood', 'uFlare', 'uVeil', 'uPointer', 'uFocus'].forEach(n => { uni[n] = gl.getUniformLocation(prog, n); });

    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); ok = false; html.classList.add('no-webgl'); });
    canvas.addEventListener('webglcontextrestored', () => { if (initGL()) { ok = true; html.classList.remove('no-webgl'); resize(); } });
    return true;
  }

  function resize() {
    if (!gl) return;
    const w = Math.max(2, Math.round(window.innerWidth * scale));
    const h = Math.max(2, Math.round(window.innerHeight * scale));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    needsStatic = true;
    A.ticker.wake();
  }

  function render(time) {
    gl.uniform2f(uni.uRes, canvas.width, canvas.height);
    gl.uniform1f(uni.uTime, time);
    gl.uniform1f(uni.uLight, state.light);
    gl.uniform1f(uni.uScroll, state.scroll);
    gl.uniform1f(uni.uMood, state.mood);
    gl.uniform1f(uni.uFlare, state.flare);
    gl.uniform1f(uni.uVeil, state.veil);
    gl.uniform2f(uni.uPointer, pointer.x, -pointer.y);
    gl.uniform2f(uni.uFocus, state.focus[0], state.focus[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function settle(dt) {
    const k = 1 - Math.exp(-dt * 1.6);
    state.light = lerp(state.light, state.lightTarget, k);
    state.mood = lerp(state.mood, state.moodTarget, 1 - Math.exp(-dt * 0.9));
    state.veil = lerp(state.veil, state.veilTarget, k);
  }
  const settled = () => Math.abs(state.light - state.lightTarget) < 0.002 && Math.abs(state.mood - state.moodTarget) < 0.002 && Math.abs(state.veil - state.veilTarget) < 0.002;

  /* ---------------- dust ---------------- */
  const dust = { canvas: null, ctx: null, parts: [], sprite: null, dpr: 1, alpha: 0, alphaTarget: 1 };

  function makeSprite() {
    const s = document.createElement('canvas');
    s.width = s.height = 32;
    const c = s.getContext('2d');
    const g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,240,205,1)');
    g.addColorStop(0.18, 'rgba(240,215,160,.8)');
    g.addColorStop(0.5, 'rgba(218,189,124,.18)');
    g.addColorStop(1, 'rgba(218,189,124,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 32, 32);
    return s;
  }

  function initDust() {
    dust.canvas = document.getElementById('world-dust');
    if (!dust.canvas) return;
    dust.ctx = dust.canvas.getContext('2d');
    dust.sprite = makeSprite();
    const n = A.motion.isSmall() ? 26 : 48;
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    dust.parts = Array.from({ length: n }, () => ({
      x: rnd(), y: rnd(), z: 0.25 + rnd() * 0.75,
      vx: (rnd() - 0.5) * 0.004, vy: -0.002 - rnd() * 0.006,
      s: 0.6 + rnd() * 1.6, ph: rnd() * 6.28, tw: 0.4 + rnd() * 1.2
    }));
    resizeDust();
  }
  function resizeDust() {
    if (!dust.canvas) return;
    dust.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    dust.canvas.width = Math.round(window.innerWidth * dust.dpr);
    dust.canvas.height = Math.round(window.innerHeight * dust.dpr);
  }
  function drawDust(f) {
    const { ctx, canvas: c } = dust;
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    dust.alpha = lerp(dust.alpha, dust.alphaTarget, 1 - Math.exp(-f.dt * 1.2));
    if (dust.alpha < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    const sy = f.scrollY;
    for (const p of dust.parts) {
      p.x += p.vx * f.dt * p.z;
      p.y += p.vy * f.dt * p.z;
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < -0.05) p.x = 1.05; else if (p.x > 1.05) p.x = -0.05;
      const px = (p.x + pointer.x * 0.012 * p.z) * W;
      let py = ((p.y - (sy / window.innerHeight) * 0.08 * p.z) % 1 + 1) % 1 * H;
      const tw = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(f.time * p.tw + p.ph), 3);
      ctx.globalAlpha = dust.alpha * tw * 0.75 * p.z;
      const s = p.s * 7 * dust.dpr * p.z;
      ctx.drawImage(dust.sprite, px - s / 2, py - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------------- public ---------------- */
  const ambient = {
    state,
    /** 0 = darkness, ~0.85 = full site exposure */
    setLight(v, instant) { state.lightTarget = v; if (instant) state.light = v; A.ticker.wake(); },
    /** −1 leans burgundy, +1 leans teal */
    setMood(v) { state.moodTarget = clamp(v, -1, 1); A.ticker.wake(); },
    setVeil(v) { state.veilTarget = v; A.ticker.wake(); },
    setDust(v) { dust.alphaTarget = v; A.ticker.wake(); },
    setFocus(x, y) { state.focus = [x, y]; },
    flare(v) { state.flare = v; A.ticker.wake(); },
    get ok() { return ok; }
  };

  ambient.init = function () {
    ok = initGL();
    if (!ok) html.classList.add('no-webgl');
    else resize();
    initDust();
    A.util.onResize(() => { resize(); resizeDust(); });

    A.ticker.add(f => {
      settle(f.dt);
      state.scroll = (f.scrollY / Math.max(1, document.documentElement.scrollHeight)) * 1.4;
      if (!ok) return;
      if (A.motion.reduced) {
        if (needsStatic || !settled()) { render(40); needsStatic = false; }
        return;
      }
      // marble moves slowly; 30 fps is visually identical and halves GPU cost
      if (f.time - lastRender >= 1 / 31 || state.flare > 0) {
        render(f.time);
        lastRender = f.time;
      }
    }, () => ok && (!A.motion.reduced || needsStatic || !settled()) || !settled());

    A.ticker.add(drawDust, () => dust.ctx && !A.motion.reduced);
    A.motion.onChange(reduced => {
      needsStatic = true;
      if (reduced && dust.ctx) dust.ctx.clearRect(0, 0, dust.canvas.width, dust.canvas.height);
      A.ticker.wake();
    });
  };

  A.ambient = ambient;
})(window.ANVAYA);
