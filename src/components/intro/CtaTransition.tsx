import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import "./cta-transition.css";

gsap.registerPlugin(MotionPathPlugin);

type CtaTransitionProps = {
  stage: HTMLElement | null;
  button: HTMLButtonElement | null;
  path: SVGPathElement | null;
  onComplete?: () => void;
};

export default function CtaTransition({ stage, button, path, onComplete }: CtaTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !stage || !button) return;

    const buttonBounds = button.getBoundingClientRect();
    const stageBounds = stage.getBoundingClientRect();
    const origin = {
      x: buttonBounds.left + buttonBounds.width / 2 - stageBounds.left,
      y: buttonBounds.top + buttonBounds.height / 2 - stageBounds.top,
    };
    const glow = overlay.querySelector<HTMLElement>(".cta-transition-glow");
    const flash = overlay.querySelector<HTMLElement>(".cta-transition-flash");
    const particles = gsap.utils.toArray<HTMLElement>(".cta-transition-particle", overlay);
    const introLayers = Array.from(stage.children).filter((child) => child !== overlay);

    gsap.set(glow, { left: origin.x, top: origin.y, scale: 0.12, autoAlpha: 0 });
    gsap.set(particles, { left: origin.x, top: origin.y, scale: 0.6, autoAlpha: 0 });
    gsap.set(flash, { autoAlpha: 0 });

    const transition = gsap.timeline({
      onComplete: () => onCompleteRef.current?.(),
    });

    transition
      .to(button, {
        scale: 0.97,
        duration: 0.07,
        repeat: 1,
        yoyo: true,
        ease: "power4.inOut",
      }, 0)
      .to(glow, {
        scale: 9,
        autoAlpha: 0.62,
        duration: 0.56,
        ease: "expo.out",
      }, 0)
      .to(glow, {
        autoAlpha: 0,
        duration: 0.28,
        ease: "power4.inOut",
      }, 0.36);

    if (path) {
      transition.to(particles, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          start: 0.56,
          end: 0.98,
        },
        autoAlpha: (index) => index % 3 === 0 ? 0.78 : 0.46,
        scale: 1,
        duration: 0.42,
        stagger: 0.015,
        ease: "power4.inOut",
      }, 0.16);
    } else {
      transition.to(particles, {
        x: (_, target) => Number((target as HTMLElement).dataset["dx"] ?? 0),
        y: (_, target) => Number((target as HTMLElement).dataset["dy"] ?? -80),
        autoAlpha: 0.48,
        duration: 0.42,
        stagger: 0.015,
        ease: "power4.inOut",
      }, 0.16);
    }

    transition
      .to(flash, {
        autoAlpha: 0.3,
        duration: 0.13,
        ease: "expo.inOut",
      }, 0.5)
      .to(introLayers, {
        autoAlpha: 0,
        filter: "blur(3px)",
        duration: 0.18,
        stagger: 0.002,
        ease: "power4.inOut",
      }, 0.5);

    return () => {
      transition.kill();
    };
  }, [button, path, stage]);

  return (
    <div ref={overlayRef} className="cta-transition-overlay" aria-hidden="true">
      <div className="cta-transition-glow" />
      <div className="cta-transition-particles">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            className="cta-transition-particle"
            data-dx={((index % 4) - 1.5) * 24}
            data-dy={-54 - index * 9}
            key={index}
          />
        ))}
      </div>
      <div className="cta-transition-flash" />
    </div>
  );
}