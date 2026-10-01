import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SplitType from "split-type";
import { Volume2, VolumeX } from "lucide-react";
import CtaTransition from "./CtaTransition";
import "./index.css";
import {
  INTRO_SOUND_STATE_EVENT,
  publishIntroSoundState,
  setIntroSoundscapeMuted,
  startIntroSoundscape,
  stopIntroSoundscape,
  type IntroSoundscape,
} from "./soundscape";

gsap.registerPlugin(MotionPathPlugin);

type CinematicIntroProps = {
  onEnter?: () => void;
};

type IntroSoundToggleProps = {
  soundscapeRef: { current: IntroSoundscape | null };
  soundMutedRef: { current: boolean };
  startSoundRef: { current: () => void };
};

function IntroSoundToggle({
  soundscapeRef,
  soundMutedRef,
  startSoundRef,
}: IntroSoundToggleProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const syncSoundState = (event: Event) => {
      setSoundEnabled((event as CustomEvent<boolean>).detail);
    };
    window.addEventListener(INTRO_SOUND_STATE_EVENT, syncSoundState);
    setSoundEnabled(
      soundscapeRef.current?.context.state === "running" && !soundMutedRef.current,
    );
    return () => window.removeEventListener(INTRO_SOUND_STATE_EVENT, syncSoundState);
  }, [soundMutedRef, soundscapeRef]);

  const toggleSound = () => {
    const current = soundscapeRef.current;
    if (current?.context.state === "running" && !soundMutedRef.current) {
      soundMutedRef.current = true;
      setIntroSoundscapeMuted(current, true);
      setSoundEnabled(false);
      return;
    }

    soundMutedRef.current = false;
    if (current?.context.state === "running") {
      setIntroSoundscapeMuted(current, false);
      setSoundEnabled(true);
    } else {
      startSoundRef.current();
    }
  };

  return (
    <button
      className="intro-sound-toggle"
      type="button"
      aria-label={soundEnabled ? "Mute intro sound" : "Play intro sound"}
      aria-pressed={soundEnabled}
      onClick={toggleSound}
      title={soundEnabled ? "Mute intro sound" : "Play intro sound"}
    >
      {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
      <span>Sound {soundEnabled ? "on" : "off"}</span>
    </button>
  );
}

const thoughts = [
  { text: "What if I fail?", left: "15%", top: "37%" },
  { text: "What if something goes wrong?", left: "48%", top: "27%" },
  { text: "I can't stop thinking.", left: "58%", top: "67%" },
  { text: "Am I doing enough?", left: "24%", top: "71%" },
  { text: "What happens next?", left: "77%", top: "46%" },
];

const milestones = [
  { label: "Understanding", left: "15%", top: "52%" },
  { label: "Root Causes", left: "39%", top: "41%" },
  { label: "Recovery", left: "64%", top: "54%" },
  { label: "Growth", left: "84%", top: "36%" },
];

const route =
  "M -80 518 C 28 518 53 438 154 438 S 257 557 350 512 S 454 346 557 375 S 644 548 750 497 S 859 322 968 350 S 1080 520 1171 458 S 1280 267 1391 307 S 1501 403 1556 348";
const routeBranches = [
  "M 350 512 C 288 455 296 351 378 315 C 456 281 518 316 557 375",
  "M 750 497 C 680 570 698 683 805 671 C 918 660 900 403 968 350",
  "M 1171 458 C 1113 398 1127 290 1213 249 C 1310 202 1352 257 1391 307",
];

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const progress = clamp01(value);
  return progress * progress * (3 - 2 * progress);
};
type Point = { x: number; y: number };

const samplePath = (points: Point[], progress: number): Point => {
  if (!points.length) return { x: 0, y: 0 };
  if (points.length === 1) return points[0] ?? { x: 0, y: 0 };
  const sample = clamp01(progress) * (points.length - 1);
  const index = Math.min(Math.floor(sample), points.length - 2);
  const mix = sample - index;
  const start = points[index];
  const end = points[index + 1];
  if (!start || !end) return points[points.length - 1] ?? { x: 0, y: 0 };
  return {
    x: start.x + (end.x - start.x) * mix,
    y: start.y + (end.y - start.y) * mix,
  };
};

export default function CinematicIntro({ onEnter }: CinematicIntroProps) {
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const cameraRef = useRef<SVGCircleElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const storyRef = useRef<gsap.core.Timeline | null>(null);
  const soundscapeRef = useRef<IntroSoundscape | null>(null);
  const soundMutedRef = useRef(false);
  const startSoundRef = useRef<() => void>(() => undefined);
  const onEnterRef = useRef(onEnter);
  const enterStartedRef = useRef(false);
  const [ctaTransitionActive, setCtaTransitionActive] = useState(false);
  onEnterRef.current = onEnter;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const startAtCurrentScene = () => {
      if (soundMutedRef.current) {
        publishIntroSoundState(false);
        return;
      }
      if (soundscapeRef.current?.context.state === "running") return;
      if (soundscapeRef.current) {
        stopIntroSoundscape(soundscapeRef.current, 0);
        soundscapeRef.current = null;
      }

      const offset = (storyRef.current?.progress() ?? 0) * 19;
      const soundscape = startIntroSoundscape(offset);
      soundscapeRef.current = soundscape;
      if (!soundscape) {
        publishIntroSoundState(false);
        return;
      }
      void soundscape.context.resume().then(() => {
        if (soundscapeRef.current === soundscape) {
          publishIntroSoundState(
            soundscape.context.state === "running" && !soundMutedRef.current,
          );
        }
      }).catch(() => {
        if (soundscapeRef.current === soundscape) publishIntroSoundState(false);
      });
    };
    startSoundRef.current = startAtCurrentScene;

    const startAfterGesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".intro-sound-toggle")) return;
      if (soundMutedRef.current) return;
      if (soundscapeRef.current?.context.state === "suspended") {
        stopIntroSoundscape(soundscapeRef.current, 0);
        soundscapeRef.current = null;
      }
      startAtCurrentScene();
    };

    startAtCurrentScene();
    stage.addEventListener("pointerdown", startAfterGesture);
    stage.addEventListener("keydown", startAfterGesture);

    return () => {
      stage.removeEventListener("pointerdown", startAfterGesture);
      stage.removeEventListener("keydown", startAfterGesture);
      if (soundscapeRef.current) stopIntroSoundscape(soundscapeRef.current, 0);
      soundscapeRef.current = null;
      startSoundRef.current = () => undefined;
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const splitInstances: SplitType[] = [];
    const interactionCleanups: Array<() => void> = [];
    const particleState = {
      gather: 0,
      route: 0,
      branches: 0,
      anchors: 0,
      travel: 0,
      warmth: 0,
      settle: 0,
    };

    const context = gsap.context(() => {
      const titles = gsap.utils.toArray<HTMLElement>(".split-title");
      const titleChars = titles.map((title) => {
        const split = new SplitType(title, { types: "chars" });
        splitInstances.push(split);
        return split.chars ?? [];
      });

      const heroChars = titleChars[0] ?? [];
      const understandingChars = titleChars[1] ?? [];
      const rootsChars = titleChars[2] ?? [];
      const recoveryChars = titleChars[3] ?? [];
      const thoughtNodes = gsap.utils.toArray<HTMLElement>(".thought-fragment");
      const milestoneNodes = gsap.utils.toArray<HTMLElement>(".milestone");
      const routePaths = gsap.utils.toArray<SVGPathElement>(".journey-stroke");

      gsap.set(heroChars, { autoAlpha: 0, yPercent: 65, filter: "blur(16px)" });
      gsap.set(".hero-kicker", { autoAlpha: 0, y: 12 });
      gsap.set(thoughtNodes, { autoAlpha: 0, filter: "blur(8px)" });
      gsap.set(milestoneNodes, { autoAlpha: 0, y: 12 });
      gsap.set(".chapter, .final-lockup", { autoAlpha: 0 });
      gsap.set([".mood-dark", ".mood-warm"], { autoAlpha: 0 });
      routePaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(".camera-light", { autoAlpha: 0 });

      const story = gsap.timeline({ paused: true });
      storyRef.current = story;
      story
        .to(particleState, { gather: 1, duration: 1.8, ease: "power3.inOut" }, 3.2)
        .to(particleState, { route: 1, duration: 3.8, ease: "power3.inOut" }, 5.3)
        .to(
          particleState,
          { branches: 1, anchors: 1, duration: 1.7, ease: "power3.inOut" },
          7.5,
        )
        .to(particleState, { travel: 1, duration: 5.2, ease: "power3.inOut" }, 9.2)
        .to(particleState, { anchors: 0, duration: 0.9, ease: "power3.inOut" }, 10.8)
        .to(particleState, { warmth: 1, duration: 2.4, ease: "power3.inOut" }, 18.2)
        .to(particleState, { settle: 1, duration: 1.8, ease: "power3.inOut" }, 21.95);

      const openingScene = gsap.timeline();
      openingScene
        .to(
          ".hero-kicker",
          { autoAlpha: 0.65, y: 0, duration: 1, ease: "expo.out" },
          0.2,
        )
        .to(
          heroChars,
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.35,
            stagger: 0.038,
            ease: "power4.out",
          },
          0.35,
        )
        .to(".hero-title", { scale: 1.035, duration: 3.2, ease: "none" }, 0.3)
        .to(
          ".hero-title, .hero-kicker",
          { autoAlpha: 0, y: -24, duration: 0.9, ease: "power3.inOut" },
          2.5,
        );
      story.add(openingScene, 0);

      const thoughtScene = gsap.timeline();
      thoughtScene
        .to(thoughtNodes, {
          autoAlpha: 0.76,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.24,
          ease: "expo.out",
        });
      thoughtNodes.forEach((thought, index) => {
        const bounds = thought.getBoundingClientRect();
        thoughtScene.to(
          thought,
          {
            x: stage.clientWidth / 2 - (bounds.left + bounds.width / 2),
            y: stage.clientHeight / 2 - (bounds.top + bounds.height / 2),
            scale: 0.72,
            autoAlpha: 0,
            filter: "blur(5px)",
            duration: 1.45,
            ease: "power3.inOut",
          },
          1.65 + index * 0.13,
        );
      });
      story.add(thoughtScene, 2.5);

      const pathScene = gsap.timeline();
      pathScene
        .to(routePaths, {
          strokeDashoffset: 0,
          duration: 3.8,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .to(".camera-light", { autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 0.25);
      story.add(pathScene, 5.3);

      const milestoneScene = gsap.timeline();
      milestoneNodes.forEach((milestone, index) => {
        milestoneScene.to(
          milestone,
          { autoAlpha: 1, y: 0, duration: 0.85, ease: "expo.out" },
          index * 0.55,
        );
      });
      story.add(milestoneScene, 7.5);

      const cameraScene = gsap.timeline();
      cameraScene
        .to(
          cameraRef.current!,
          {
            motionPath: {
              path: routeRef.current!,
              align: routeRef.current!,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
              start: 0.04,
              end: 0.96,
            },
            duration: 5.2,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          ".journey-world",
          { scale: 1.16, xPercent: -2, yPercent: -1, duration: 5.2, ease: "power3.inOut" },
          0,
        )
        .to(milestoneNodes, { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 1.8);
      story.add(cameraScene, 9.2);

      const understandingScene = gsap.timeline();
      understandingScene
        .to(".chapter--understanding", { autoAlpha: 1, duration: 0.6, ease: "expo.out" })
        .fromTo(
          understandingChars,
          { autoAlpha: 0, yPercent: 45, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.15,
            stagger: 0.045,
            ease: "power4.out",
          },
          0.08,
        )
        .to(".chapter--understanding", { autoAlpha: 0, y: -20, duration: 0.7 }, 2.45);
      story.add(understandingScene, 11.2);

      const rootsScene = gsap.timeline();
      rootsScene
        .to(".mood-dark", { autoAlpha: 1, duration: 1.3, ease: "power3.inOut" }, 0)
        .to(".chapter--roots", { autoAlpha: 1, duration: 0.7, ease: "expo.out" }, 0.25)
        .fromTo(
          rootsChars,
          { autoAlpha: 0, yPercent: 42, filter: "blur(13px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.32,
        )
        .to(".chapter--roots", { autoAlpha: 0, y: -18, duration: 0.75 }, 2.35);
      story.add(rootsScene, 14.7);

      const recoveryScene = gsap.timeline();
      recoveryScene
        .to(".mood-dark", { autoAlpha: 0.15, duration: 1.6, ease: "power3.inOut" }, 0)
        .to(".mood-warm", { autoAlpha: 1, duration: 2, ease: "power3.inOut" }, 0)
        .to(".chapter--recovery", { autoAlpha: 1, duration: 0.8, ease: "expo.out" }, 0.2)
        .fromTo(
          recoveryChars,
          { autoAlpha: 0, yPercent: 40, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.3,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.28,
        )
        .to(".chapter--recovery", { autoAlpha: 0, y: -16, duration: 0.8 }, 2.5);
      story.add(recoveryScene, 18.2);

      const finaleScene = gsap.timeline();
      finaleScene
        .to(".final-lockup", { autoAlpha: 1, duration: 1.2, ease: "expo.out" }, 0)
        .fromTo(
          ".final-lockup > *",
          { y: 18, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.25,
            stagger: 0.18,
            ease: "expo.out",
          },
          0.05,
        )
        .to(
          ".journey-world",
          { scale: 1.08, xPercent: 0, yPercent: 0, duration: 2.5, ease: "power3.inOut" },
          0,
        );
      story.add(finaleScene, 21.95);

      const farMist = gsap.timeline({ repeat: -1, yoyo: true }).to(".mist--far", {
        xPercent: 7,
        yPercent: -5,
        scale: 1.08,
        duration: 12,
        ease: "sine.inOut",
      });
      const nearMist = gsap.timeline({ repeat: -1, yoyo: true }).to(".mist--near", {
        xPercent: -6,
        yPercent: 4,
        scale: 1.12,
        duration: 16,
        ease: "sine.inOut",
      });

      const cursor = cursorRef.current;
      const beginButton = buttonRef.current;
      const moveCursorX = cursor ? gsap.quickTo(cursor, "x", { duration: 0.7, ease: "power3.out" }) : null;
      const moveCursorY = cursor ? gsap.quickTo(cursor, "y", { duration: 0.7, ease: "power3.out" }) : null;
      const moveButtonX = beginButton ? gsap.quickTo(beginButton, "x", { duration: 0.45, ease: "power3.out" }) : null;
      const moveButtonY = beginButton ? gsap.quickTo(beginButton, "y", { duration: 0.45, ease: "power3.out" }) : null;

      const handlePointerMove = (event: PointerEvent) => {
        moveCursorX?.(event.clientX);
        moveCursorY?.(event.clientY);
      };
      const handleButtonMove = (event: PointerEvent) => {
        if (!beginButton) return;
        const bounds = beginButton.getBoundingClientRect();
        moveButtonX?.((event.clientX - bounds.left - bounds.width / 2) * 0.12);
        moveButtonY?.((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      };
      const resetButton = () => {
        moveButtonX?.(0);
        moveButtonY?.(0);
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      beginButton?.addEventListener("pointermove", handleButtonMove, { passive: true });
      beginButton?.addEventListener("pointerleave", resetButton);

      const buttonGlow = cursor;
      const handleButtonHover = () => buttonGlow?.classList.add("is-near-button");
      const handleButtonLeave = () => buttonGlow?.classList.remove("is-near-button");
      beginButton?.addEventListener("pointerenter", handleButtonHover);
      beginButton?.addEventListener("pointerleave", handleButtonLeave);

      interactionCleanups.push(() => {
        window.removeEventListener("pointermove", handlePointerMove);
        beginButton?.removeEventListener("pointermove", handleButtonMove);
        beginButton?.removeEventListener("pointerleave", resetButton);
        beginButton?.removeEventListener("pointerenter", handleButtonHover);
        beginButton?.removeEventListener("pointerleave", handleButtonLeave);
        farMist.kill();
        nearMist.kill();
      });

      story.timeScale(1.28).play(0);
    }, stage);

    const canvasContext = canvas.getContext("2d");
    const pathElement = routeRef.current;
    const readPath = (path: SVGPathElement): Point[] => {
      const length = path.getTotalLength();
      return Array.from({ length: 129 }, (_, index) => {
        const point = path.getPointAtLength((length * index) / 128);
        return { x: point.x, y: point.y };
      });
    };
    const pathSamples = pathElement ? readPath(pathElement) : [];
    const branchSamples = Array.from(
      stage.querySelectorAll<SVGPathElement>(".journey-stroke--branch"),
      readPath,
    );
    let frameId = 0;
    let pointerX = -1000;
    let pointerY = -1000;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let anchorPositions: Point[] = [];
    const particleCount = 72;
    const milestoneElements = Array.from(stage.querySelectorAll<HTMLElement>(".milestone"));
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.15 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.22 + 0.06,
      depth: Math.random(),
      routeOffset: Math.random(),
      branchIndex: index % 4 === 0 ? Math.floor(Math.random() * 3) : -1,
      anchorIndex: index % 7 === 0 ? Math.floor(index / 7) % milestones.length : -1,
      anchorOffset: Math.random() * Math.PI * 2,
    }));

    const resizeCanvas = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = stage.clientWidth;
      canvasHeight = stage.clientHeight;
      canvas.width = canvasWidth * pixelRatio;
      canvas.height = canvasHeight * pixelRatio;
      canvasContext?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const stageBounds = stage.getBoundingClientRect();
      anchorPositions = milestoneElements.map((milestone) => {
        const bounds = milestone.getBoundingClientRect();
        return {
          x: bounds.left + bounds.width / 2 - stageBounds.left,
          y: bounds.top + bounds.height / 2 - stageBounds.top,
        };
      });
    };

    const trackPointer = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };

    const drawParticles = (time: number) => {
      if (!canvasContext) return;
      canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
      const gather = smoothstep(particleState.gather);
      const routeBlend = smoothstep(particleState.route);
      const branchBlend = smoothstep(particleState.branches);
      const anchorBlend = smoothstep(particleState.anchors) * (1 - particleState.settle * 0.6);
      const travel = particleState.travel * (1 - particleState.settle * 0.78);
      const warm = smoothstep(particleState.warmth);
      const pathScale = Math.max(canvasWidth / 1440, canvasHeight / 900);
      const pathOffsetX = (canvasWidth - 1440 * pathScale) / 2;
      const pathOffsetY = (canvasHeight - 900 * pathScale) / 2;

      particles.forEach((particle) => {
        const drift = time * particle.speed * 0.001 + particle.phase;
        const depthDrift = 5 + particle.depth * 17;
        const pointerParallax = particle.depth * 0.012;
        const freeX = particle.x * canvasWidth + Math.sin(drift) * depthDrift - (pointerX - canvasWidth / 2) * pointerParallax;
        const freeY = ((particle.y * canvasHeight - time * particle.speed * (0.008 + particle.depth * 0.01)) % canvasHeight + canvasHeight) % canvasHeight - (pointerY - canvasHeight / 2) * pointerParallax;
        const gatheredX = canvasWidth / 2 + (particle.x - 0.5) * 54;
        const gatheredY = canvasHeight / 2 + (particle.y - 0.5) * 42;
        const routeProgressForParticle =
          ((particle.routeOffset + travel * 0.12) % 1) * Math.max(particleState.route, 0.025);
        const mainPoint = samplePath(pathSamples, routeProgressForParticle);
        const branchPoint = particle.branchIndex >= 0
          ? samplePath(branchSamples[particle.branchIndex] ?? pathSamples, routeProgressForParticle)
          : mainPoint;
        const routePoint = {
          x: pathOffsetX + (mainPoint.x + (branchPoint.x - mainPoint.x) * (particle.branchIndex >= 0 ? branchBlend : 0)) * pathScale,
          y: pathOffsetY + (mainPoint.y + (branchPoint.y - mainPoint.y) * (particle.branchIndex >= 0 ? branchBlend : 0)) * pathScale,
        };
        const preRouteX = freeX + (gatheredX - freeX) * gather;
        const preRouteY = freeY + (gatheredY - freeY) * gather;
        let x = preRouteX + (routePoint.x - preRouteX) * routeBlend;
        let y = preRouteY + (routePoint.y - preRouteY) * routeBlend;
        const anchor = anchorPositions[particle.anchorIndex];
        if (particle.anchorIndex >= 0 && anchor) {
          const orbit = drift + particle.anchorOffset;
          const accentX = anchor.x + Math.cos(orbit) * (4 + particle.depth * 5);
          const accentY = anchor.y + Math.sin(orbit) * (4 + particle.depth * 5);
          x += (accentX - x) * anchorBlend;
          y += (accentY - y) * anchorBlend;
        }
        const dx = x - pointerX;
        const dy = y - pointerY;
        const distance = Math.hypot(dx, dy);
        const response = distance < 150 ? (1 - distance / 150) * 7 : 0;
        canvasContext.beginPath();
        canvasContext.arc(x + (dx / (distance || 1)) * response, y + (dy / (distance || 1)) * response, particle.radius * (0.7 + particle.depth * 0.6), 0, Math.PI * 2);
        const red = Math.round(139 + (192 - 139) * warm);
        const green = Math.round(125 + (132 - 125) * warm);
        const blue = Math.round(255 + (252 - 255) * warm);
        const alpha = 0.13 + (Math.sin(drift * 0.55) + 1) * 0.055 + routeBlend * 0.09 + anchorBlend * 0.04;
        canvasContext.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        canvasContext.fill();
      });
      frameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    stage.addEventListener("pointermove", trackPointer, { passive: true });
    frameId = requestAnimationFrame(drawParticles);

    return () => {
      cancelAnimationFrame(frameId);
      interactionCleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("resize", resizeCanvas);
      stage.removeEventListener("pointermove", trackPointer);
      context.revert();
      splitInstances.forEach((split) => split.revert());
      storyRef.current = null;
    };
  }, []);

  const beginJourney = () => {
    if (!stageRef.current || enterStartedRef.current) return;

    enterStartedRef.current = true;
    storyRef.current?.pause();
    if (soundscapeRef.current) {
      stopIntroSoundscape(soundscapeRef.current, 0.65);
      soundscapeRef.current = null;
    }
    setCtaTransitionActive(true);
  };

  return (
    <main
      className="cinematic-experience"
      aria-label="MindEase AI cinematic opening"
    >
      <section ref={stageRef} className="film-stage" aria-label="A story in motion">
        <IntroSoundToggle
          soundscapeRef={soundscapeRef}
          soundMutedRef={soundMutedRef}
          startSoundRef={startSoundRef}
        />
        <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />

        <div className="atmosphere atmosphere--base" aria-hidden="true" />
        <div className="atmosphere atmosphere--dark mood-dark" aria-hidden="true" />
        <div className="atmosphere atmosphere--warm mood-warm" aria-hidden="true" />
        <div className="mist mist--far" aria-hidden="true" />
        <div className="mist mist--near" aria-hidden="true" />

        <svg
          className="journey-map"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g className="journey-world">
            <path className="journey-stroke journey-stroke--halo" d={route} />
            {routeBranches.map((branch, index) => (
              <path
                className={`journey-stroke journey-stroke--branch journey-stroke--branch-${index + 1}`}
                d={branch}
                key={branch}
              />
            ))}
            <path ref={routeRef} className="journey-stroke journey-stroke--main" d={route} />
            <path className="journey-stroke journey-stroke--core" d={route} />
            <circle ref={cameraRef} className="camera-light" r="5" cx="0" cy="0" />
          </g>
        </svg>

        <div className="thought-field" aria-hidden="true">
          {thoughts.map((thought) => (
            <span
              className="thought-fragment"
              key={thought.text}
              style={{ left: thought.left, top: thought.top }}
            >
              {thought.text}
            </span>
          ))}
        </div>

        <div className="milestone-field" aria-hidden="true">
          {milestones.map((milestone) => (
            <div
              className="milestone"
              key={milestone.label}
              style={{ left: milestone.left, top: milestone.top }}
            >
              <span className="milestone-mark" />
              <span>{milestone.label}</span>
            </div>
          ))}
        </div>

        <div className="opening-copy">
          <p className="hero-kicker">MINDEASE AI</p>
          <h1 className="hero-title split-title">
            EVERY MIND
            <br />
            HAS A STORY
          </h1>
        </div>

        <section className="chapter chapter--understanding" aria-label="Understanding">
          <h2 className="chapter-title split-title">UNDERSTANDING</h2>
        </section>
        <section className="chapter chapter--roots" aria-label="Root causes">
          <h2 className="chapter-title split-title">ROOT CAUSES</h2>
        </section>
        <section className="chapter chapter--recovery" aria-label="Recovery and growth">
          <h2 className="chapter-title split-title">RECOVERY <span>&amp;</span> GROWTH</h2>
        </section>

        <div className="final-lockup">
          <p className="final-brand">MindEase <span>AI</span></p>
          <p className="final-promise">Understanding minds.<br />Healthier tomorrows.</p>
          <p className="trust-note">AI for reflection, not diagnosis.</p>
          <button ref={buttonRef} className="begin-button" onClick={beginJourney} type="button">
            <span>Begin Your Journey</span>
            <span className="button-arrow" aria-hidden="true">↗</span>
          </button>
        </div>

        <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />
        {ctaTransitionActive && (
          <CtaTransition
            stage={stageRef.current}
            button={buttonRef.current}
            path={routeRef.current}
            onComplete={() => onEnterRef.current?.()}
          />
        )}
      </section>
    </main>
  );
}