import { useEffect, useRef, type RefObject } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Steam rising from the cup: a single fragment shader (domain-warped simplex FBM)
 * on raw WebGL. ~3 KB instead of a 150 KB 3D engine. The cursor pushes the steam
 * aside and its movement bends the plume like a draught.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uSrc;
uniform vec2 uMouse;
uniform float uWind;
uniform float uScale;
uniform float uAlpha;

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float fbm(vec2 p){
  float f=0.0;float a=0.5;
  for(int i=0;i<4;i++){f+=a*snoise(p);p=p*2.02+vec2(1.7,9.2);a*=0.5;}
  return f;
}
void main(){
  vec2 frag=gl_FragCoord.xy;
  // cursor pushes the steam away
  vec2 dm=(frag-uMouse)/uScale;
  float md=length(dm);
  frag+=normalize(dm+1e-4)*exp(-md*md*7.0)*uScale*0.22;

  vec2 p=(frag-uSrc)/uScale;
  float h=p.y;
  if(h<-0.06){gl_FragColor=vec4(0.0);return;}
  float t=uTime;

  float bend=uWind*h*h*0.85+sin(t*0.31+h*2.3)*0.07*h+sin(t*0.17)*0.03*h;
  float x=p.x-bend;
  float width=0.11+h*0.55;
  float xn=x/width;

  vec2 q=vec2(xn*0.75,h*1.35-t*0.24);
  float warp=fbm(q*0.85+vec2(0.0,-t*0.05));
  float n=fbm(q+vec2(warp*1.5,warp*0.7))*0.5+0.5;

  float column=exp(-xn*xn*1.9);
  float rise=smoothstep(-0.05,0.14,h)*(1.0-smoothstep(0.35,1.6,h));
  float wisp=smoothstep(0.36,0.8,n);
  float a=column*rise*wisp;
  a=min(pow(a,1.1)*uAlpha*1.12,0.8);
  vec3 col=mix(vec3(1.0,0.9,0.78),vec3(1.0,0.97,0.93),clamp(h,0.0,1.0));
  gl_FragColor=vec4(col*a,a);
}`

type Props = {
  /** element the steam rises from (the arch photo) */
  sourceRef: RefObject<HTMLElement | null>
  /** source point inside that element, 0–1 */
  anchor?: { x: number; y: number }
  active: boolean
  className?: string
}

export default function SteamCanvas({ sourceRef, anchor = { x: 0.5, y: 0.6 }, active, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const kickRef = useRef<() => void>(() => {})
  activeRef.current = active

  useEffect(() => {
    kickRef.current()
  }, [active])

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' })
    if (!gl || gl.isContextLost()) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const u = (name: string) => gl.getUniformLocation(prog, name)
    const uRes = u('uRes')
    const uTime = u('uTime')
    const uSrc = u('uSrc')
    const uMouse = u('uMouse')
    const uWind = u('uWind')
    const uScale = u('uScale')
    const uAlpha = u('uAlpha')

    const reduced = prefersReducedMotion()
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const quality = coarse ? 0.45 : 0.6
    let scale = 1
    let raf = 0
    let visible = true
    let alpha = 0
    let wind = 0
    let windTarget = 0
    const mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, lastX: 0, lastT: 0 }
    const start = performance.now()

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      scale = Math.min(window.devicePixelRatio || 1, 2) * quality
      canvas.width = Math.max(1, Math.round(r.width * scale))
      canvas.height = Math.max(1, Math.round(r.height * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) * scale
      mouse.y = (r.height - (e.clientY - r.top)) * scale
      const now = performance.now()
      const dt = Math.max(16, now - mouse.lastT)
      const vx = (e.clientX - mouse.lastX) / dt
      windTarget = Math.max(-1.4, Math.min(1.4, windTarget + vx * 0.35))
      mouse.lastX = e.clientX
      mouse.lastT = now
    }
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(frame)
    })
    io.observe(canvas)

    function frame(now: number) {
      raf = 0
      const src = sourceRef.current
      if (!src || !visible || document.hidden) return
      const cr = canvas.getBoundingClientRect()
      const sr = src.getBoundingClientRect()
      const sx = (sr.left - cr.left + sr.width * anchor.x) * scale
      const sy = (cr.height - (sr.top - cr.top + sr.height * anchor.y)) * scale

      alpha += ((activeRef.current ? 1 : 0) - alpha) * 0.025
      windTarget *= 0.965
      wind += (windTarget - wind) * 0.05
      mouse.sx += (mouse.x - mouse.sx) * 0.12
      mouse.sy += (mouse.y - mouse.sy) * 0.12

      gl!.clearColor(0, 0, 0, 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.uniform2f(uRes, canvas.width, canvas.height)
      gl!.uniform1f(uTime, reduced ? 14 : (now - start) / 1000)
      gl!.uniform2f(uSrc, sx, sy)
      gl!.uniform2f(uMouse, mouse.sx, mouse.sy)
      gl!.uniform1f(uWind, wind)
      gl!.uniform1f(uScale, Math.max(120, sr.width * scale * 1.05))
      gl!.uniform1f(uAlpha, reduced ? (activeRef.current ? 1 : 0) : alpha)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)

      // Reduced motion: a still image of the steam, redrawn only when needed.
      if (reduced && activeRef.current) return
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame)
    }
    kickRef.current = onVis
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      // Keep the context alive (StrictMode remounts reuse this canvas); just free our objects.
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [sourceRef, anchor.x, anchor.y])

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none ${className}`} />
}
