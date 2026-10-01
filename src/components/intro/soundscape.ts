type ToneLayer = {
  frequency: number;
  start: number;
  end: number;
  gain: number;
  attack: number;
  release: number;
  pan?: number;
  type?: OscillatorType;
  decay?: number;
  sustain?: number;
};

export type IntroSoundscape = {
  context: AudioContext;
  master: GainNode;
  closeTimer: number;
};

export const INTRO_SOUND_STATE_EVENT = "mindease-intro-sound-state";
const SOUND_DURATION = 19;
const MASTER_GAIN = 2.4;

export function publishIntroSoundState(enabled: boolean): void {
  window.dispatchEvent(new CustomEvent(INTRO_SOUND_STATE_EVENT, { detail: enabled }));
}

const tones: ToneLayer[] = [
  { frequency: 174.61, start: 0, end: 19, gain: 0.047, attack: 3.2, release: 2.2, pan: -0.12 },
  { frequency: 220, start: 0, end: 19, gain: 0.018, attack: 3.7, release: 2.2, pan: 0.08 },
  { frequency: 261.63, start: 0, end: 19, gain: 0.03, attack: 3.6, release: 2.2, pan: 0.12 },
  { frequency: 349.23, start: 0, end: 19, gain: 0.016, attack: 4, release: 2.2 },
  { frequency: 392, start: 1, end: 19, gain: 0.009, attack: 4, release: 2.2, pan: 0.18 },
  { frequency: 783.99, start: 3.6, end: 5.9, gain: 0.009, attack: 0.5, release: 1.3, decay: 0.5, sustain: 0.14, pan: -0.28 },
  { frequency: 987.77, start: 5.3, end: 7.6, gain: 0.008, attack: 0.6, release: 1.3, decay: 0.5, sustain: 0.14, pan: 0.25 },
  { frequency: 880, start: 7.1, end: 9.4, gain: 0.008, attack: 0.55, release: 1.3, decay: 0.55, sustain: 0.14, pan: -0.16 },
  { frequency: 698.46, start: 8.4, end: 10.7, gain: 0.009, attack: 0.65, release: 1.3, decay: 0.55, sustain: 0.14, pan: 0.2 },
  { frequency: 523.25, start: 9, end: 19, gain: 0.015, attack: 4.2, release: 2.1, pan: -0.18 },
  { frequency: 659.25, start: 10.2, end: 19, gain: 0.009, attack: 4.5, release: 2.1, pan: 0.16 },
  { frequency: 440, start: 11.1, end: 19, gain: 0.008, attack: 4.4, release: 2.1 },
  { frequency: 523.25, start: 10.4, end: 12.9, gain: 0.012, attack: 0.025, release: 0.9, decay: 1.1, sustain: 0.035, type: "triangle", pan: -0.12 },
  { frequency: 1046.5, start: 10.4, end: 11.8, gain: 0.0025, attack: 0.015, release: 0.7, decay: 0.45, sustain: 0.02, pan: -0.12 },
  { frequency: 698.46, start: 13.8, end: 16.3, gain: 0.01, attack: 0.025, release: 0.9, decay: 1.1, sustain: 0.035, type: "triangle", pan: 0.14 },
  { frequency: 1396.91, start: 13.8, end: 15.2, gain: 0.002, attack: 0.015, release: 0.7, decay: 0.45, sustain: 0.02, pan: 0.14 },
  { frequency: 698.46, start: 17.05, end: 19, gain: 0.018, attack: 0.04, release: 1.5, decay: 0.7, sustain: 0.12, pan: -0.1 },
  { frequency: 880, start: 17.12, end: 19, gain: 0.012, attack: 0.05, release: 1.5, decay: 0.72, sustain: 0.12, pan: 0.1 },
  { frequency: 1046.5, start: 17.2, end: 19, gain: 0.01, attack: 0.04, release: 1.45, decay: 0.68, sustain: 0.1 },
  { frequency: 1396.91, start: 17.2, end: 18.8, gain: 0.002, attack: 0.03, release: 1.25, decay: 0.55, sustain: 0.08 },
];

function amplitudeAt(tone: ToneLayer, elapsed: number): number {
  if (elapsed < 0 || elapsed >= tone.end - tone.start) return 0;

  const sustain = tone.sustain ?? 1;
  let amplitude = tone.gain;
  if (elapsed < tone.attack) {
    amplitude *= elapsed / tone.attack;
  } else if (tone.decay && elapsed < tone.attack + tone.decay) {
    const progress = (elapsed - tone.attack) / tone.decay;
    amplitude *= 1 - (1 - sustain) * progress;
  } else {
    amplitude *= sustain;
  }

  const releaseStart = tone.end - tone.release - tone.start;
  if (elapsed > releaseStart) {
    amplitude *= Math.max(0, (tone.end - tone.start - elapsed) / tone.release);
  }
  return amplitude;
}

function scheduleTone(
  context: AudioContext,
  output: AudioNode,
  offset: number,
  tone: ToneLayer,
): void {
  if (tone.end <= offset) return;

  const now = context.currentTime;
  const gain = context.createGain();
  const pan = context.createStereoPanner();
  const oscillator = context.createOscillator();
  const startAt = now + Math.max(0, tone.start - offset);
  const endAt = now + tone.end - offset;
  const releaseStart = tone.end - tone.release;
  const decayEnd = tone.start + tone.attack + (tone.decay ?? 0);

  oscillator.type = tone.type ?? "sine";
  oscillator.frequency.setValueAtTime(tone.frequency, startAt);
  pan.pan.setValueAtTime(tone.pan ?? 0, startAt);
  gain.gain.setValueAtTime(amplitudeAt(tone, offset - tone.start), now);

  if (offset < tone.start) gain.gain.setValueAtTime(0, startAt);
  const attackEnd = tone.start + tone.attack;
  if (attackEnd > offset) {
    gain.gain.linearRampToValueAtTime(tone.gain, now + attackEnd - offset);
  }
  if (tone.decay && decayEnd > offset) {
    gain.gain.linearRampToValueAtTime(
      tone.gain * (tone.sustain ?? 1),
      now + decayEnd - offset,
    );
  }
  if (releaseStart > offset) {
    gain.gain.setValueAtTime(
      amplitudeAt(tone, releaseStart - tone.start),
      now + releaseStart - offset,
    );
  }
  gain.gain.linearRampToValueAtTime(0.0001, endAt);

  oscillator.connect(gain);
  gain.connect(pan);
  pan.connect(output);
  oscillator.start(startAt);
  oscillator.stop(endAt + 0.05);
}

export function startIntroSoundscape(offset = 0): IntroSoundscape | null {
  if (typeof window === "undefined" || offset >= SOUND_DURATION) return null;

  const context = new AudioContext();
  const master = context.createGain();
  const limiter = context.createDynamicsCompressor();
  const filter = context.createBiquadFilter();
  const delay = context.createDelay(1);
  const delayFilter = context.createBiquadFilter();
  const delayFeedback = context.createGain();
  const echoGain = context.createGain();

  master.gain.setValueAtTime(0, context.currentTime);
  master.gain.linearRampToValueAtTime(MASTER_GAIN, context.currentTime + 0.5);
  limiter.threshold.value = -6;
  limiter.knee.value = 5;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.22;
  filter.type = "lowpass";
  filter.frequency.value = 3600;
  filter.Q.value = 0.35;
  delay.delayTime.value = 0.48;
  delayFilter.type = "lowpass";
  delayFilter.frequency.value = 2400;
  delayFeedback.gain.value = 0.12;
  echoGain.gain.value = 0.14;

  filter.connect(master);
  filter.connect(delay);
  delay.connect(delayFilter);
  delayFilter.connect(echoGain);
  echoGain.connect(master);
  delayFilter.connect(delayFeedback);
  delayFeedback.connect(delay);
  master.connect(limiter);
  limiter.connect(context.destination);

  tones.forEach((tone) => scheduleTone(context, filter, offset, tone));
  void context.resume().catch(() => undefined);

  const closeTimer = window.setTimeout(() => {
    publishIntroSoundState(false);
    if (context.state !== "closed") void context.close().catch(() => undefined);
  }, (SOUND_DURATION - offset + 1) * 1000);

  return { context, master, closeTimer };
}

export function stopIntroSoundscape(soundscape: IntroSoundscape, fadeSeconds = 0.45): void {
  window.clearTimeout(soundscape.closeTimer);
  const { context, master } = soundscape;
  publishIntroSoundState(false);
  if (context.state === "closed") return;

  const now = context.currentTime;
  const fade = Math.max(0, fadeSeconds);
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + fade);
  window.setTimeout(() => {
    if (context.state !== "closed") void context.close().catch(() => undefined);
  }, fade * 1000 + 80);
}

export function setIntroSoundscapeMuted(soundscape: IntroSoundscape, muted: boolean): void {
  if (soundscape.context.state === "closed") return;

  const now = soundscape.context.currentTime;
  soundscape.master.gain.cancelScheduledValues(now);
  soundscape.master.gain.setValueAtTime(soundscape.master.gain.value, now);
  soundscape.master.gain.linearRampToValueAtTime(muted ? 0 : MASTER_GAIN, now + 0.18);
  publishIntroSoundState(!muted && soundscape.context.state === "running");
}
