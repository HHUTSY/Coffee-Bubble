/**
 * Café ambience — off by default, starts only after a click on the sound toggle.
 *
 * If /audio/ambient.mp3 exists it is looped. Otherwise a quiet café is synthesised
 * with WebAudio (no files needed): room tone, a murmur of voices, the odd clink
 * of a cup and, now and then, the steam wand.
 */
import { useSyncExternalStore } from 'react'

type Listener = () => void

class CafeAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private timers: number[] = []
  private nodes: AudioNode[] = []
  private media: HTMLAudioElement | null = null
  private listeners = new Set<Listener>()
  enabled = false

  subscribe = (fn: Listener) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  private emit() {
    this.listeners.forEach((fn) => fn())
  }

  async toggle() {
    if (this.enabled) this.stop()
    else await this.start()
  }

  async start() {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    this.ctx ??= new Ctx()
    await this.ctx.resume()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(this.ctx.destination)

    const hasFile = await fetch(`${import.meta.env.BASE_URL}audio/ambient.mp3`, { method: 'HEAD' })
      .then((r) => r.ok && (r.headers.get('content-type') ?? '').includes('audio'))
      .catch(() => false)

    if (hasFile) this.playFile()
    else this.synthesise()

    this.master.gain.linearRampToValueAtTime(0.55, this.ctx.currentTime + 1.6)
    this.enabled = true
    this.emit()
  }

  stop() {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const master = this.master
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
    this.timers.forEach((t) => window.clearTimeout(t))
    this.timers = []
    const nodes = this.nodes
    const media = this.media
    this.nodes = []
    this.media = null
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          ;(n as AudioScheduledSourceNode).stop?.()
        } catch {
          /* already stopped */
        }
        n.disconnect()
      })
      media?.pause()
      master.disconnect()
    }, 700)
    this.master = null
    this.enabled = false
    this.emit()
  }

  /** Short crunch for pastry hover (only when sound is on). */
  crunch() {
    if (!this.enabled || !this.ctx || !this.master) return
    const ctx = this.ctx
    const t = ctx.currentTime
    for (let i = 0; i < 3; i++) {
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(0.09, 'white')
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1400 + Math.random() * 2600
      bp.Q.value = 1.4
      const g = ctx.createGain()
      const start = t + i * (0.025 + Math.random() * 0.03)
      g.gain.setValueAtTime(0, start)
      g.gain.linearRampToValueAtTime(0.32, start + 0.004)
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.07)
      src.connect(bp).connect(g).connect(this.master)
      src.start(start)
      src.stop(start + 0.1)
    }
  }

  private playFile() {
    if (!this.ctx || !this.master) return
    const audio = new Audio(`${import.meta.env.BASE_URL}audio/ambient.mp3`)
    audio.loop = true
    audio.crossOrigin = 'anonymous'
    const src = this.ctx.createMediaElementSource(audio)
    src.connect(this.master)
    void audio.play()
    this.media = audio
    this.nodes.push(src)
  }

  private noiseBuffer(seconds: number, color: 'white' | 'brown' | 'pink') {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    let last = 0
    let b0 = 0
    let b1 = 0
    let b2 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      if (color === 'white') data[i] = w
      else if (color === 'brown') {
        last = (last + 0.02 * w) / 1.02
        data[i] = last * 3.5
      } else {
        b0 = 0.99765 * b0 + w * 0.099046
        b1 = 0.963 * b1 + w * 0.2965164
        b2 = 0.57 * b2 + w * 1.0526913
        data[i] = (b0 + b1 + b2 + w * 0.1848) * 0.12
      }
    }
    return buf
  }

  private loop(buffer: AudioBuffer, filter: BiquadFilterType, freq: number, gain: number, q = 0.7) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const f = ctx.createBiquadFilter()
    f.type = filter
    f.frequency.value = freq
    f.Q.value = q
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(f).connect(g).connect(this.master!)
    src.start()
    this.nodes.push(src, f, g)
    return g
  }

  private synthesise() {
    const ctx = this.ctx!
    // Room tone
    this.loop(this.noiseBuffer(4, 'brown'), 'lowpass', 420, 0.5)
    // Murmur of voices: band-limited pink noise with a slow, uneven swell
    const murmur = this.loop(this.noiseBuffer(5, 'pink'), 'bandpass', 520, 0.22, 0.9)
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.13
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.09
    lfo.connect(lfoGain).connect(murmur.gain)
    lfo.start()
    this.nodes.push(lfo, lfoGain)

    const clink = () => {
      if (!this.master) return
      const t = ctx.currentTime
      const pan = ctx.createStereoPanner()
      pan.pan.value = Math.random() * 1.6 - 0.8
      pan.connect(this.master)
      const base = 1900 + Math.random() * 1600
      ;[1, 2.76, 5.4].forEach((ratio, i) => {
        const o = ctx.createOscillator()
        o.type = 'sine'
        o.frequency.value = base * ratio
        const g = ctx.createGain()
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(0.035 / (i + 1), t + 0.003)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5 - i * 0.12)
        o.connect(g).connect(pan)
        o.start(t)
        o.stop(t + 0.6)
      })
      this.timers.push(window.setTimeout(clink, 2500 + Math.random() * 7000))
    }

    const steamWand = () => {
      if (!this.master) return
      const t = ctx.currentTime
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(4.5, 'white')
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 2800
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.028, t + 0.5)
      g.gain.setValueAtTime(0.028, t + 3)
      g.gain.linearRampToValueAtTime(0, t + 4.2)
      src.connect(hp).connect(g).connect(this.master)
      src.start(t)
      src.stop(t + 4.5)
      this.timers.push(window.setTimeout(steamWand, 22000 + Math.random() * 26000))
    }

    this.timers.push(window.setTimeout(clink, 1200))
    this.timers.push(window.setTimeout(steamWand, 7000))
  }
}

export const cafeAudio = new CafeAudio()

export function useSoundEnabled() {
  return useSyncExternalStore(
    cafeAudio.subscribe,
    () => cafeAudio.enabled,
    () => false,
  )
}
