// Shared motion setup for every animated section (see kirana-2fe).
// Import { motionReady } and register section animations through it so the
// desktop/mobile split and the reduced-motion guard live in exactly one place.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const EASE = 'power3.out';
export const DURATION = 0.9;

/** House scroll-trigger point: the element is well inside the viewport
    before its entrance plays, so the animation is actually seen. */
export const REVEAL_START = 'top 72%';

/** Matches the CSS breakpoint below which pinned/heavy effects are dropped. */
export const DESKTOP = '(min-width: 1024px)';
export const MOBILE = '(max-width: 1023.98px)';
export const REDUCED = 'prefers-reduced-motion: reduce';

type MotionCallback = (ctx: gsap.Context) => void | (() => void);

interface MotionContexts {
  /** Full experience: pinning, scroll-linked canvases, hover states. */
  desktop?: MotionCallback;
  /** Simplified: entrances and cheap effects only. */
  mobile?: MotionCallback;
  /** Reduce-motion visitors: leave the DOM static. Usually omitted. */
  reduced?: MotionCallback;
}

/**
 * Register a section's animations. Callbacks only run in their matching
 * viewport/preference context; a returned function is used as cleanup when
 * the context is invalidated (e.g. a resize crossing the breakpoint).
 * Reduce-motion visitors get no animation at all unless a `reduced`
 * callback explicitly opts in to something static-safe.
 */
export function motionReady(scope: Element, contexts: MotionContexts): void {
  // Dev/testing affordance: ?static=1 renders the page in its final state
  // with no animation, exactly like a reduce-motion visitor sees it.
  const forceStatic = new URLSearchParams(window.location.search).has('static');

  const mm = gsap.matchMedia(scope);

  mm.add(
    {
      isDesktop: DESKTOP,
      isMobile: MOBILE,
      reduceMotion: `(${REDUCED})`,
    },
    (context) => {
      const { isDesktop, reduceMotion } = context.conditions as {
        isDesktop: boolean;
        isMobile: boolean;
        reduceMotion: boolean;
      };

      if (reduceMotion || forceStatic) return contexts.reduced?.(context);
      if (isDesktop) return contexts.desktop?.(context);
      return contexts.mobile?.(context);
    },
  );
}

/**
 * Run an intro the moment the page is actually being looked at. In a
 * background tab rAF is suspended and a load-time intro would freeze on
 * its first frame; deferring keeps the DOM in its default visible state
 * until the visitor can watch the animation play.
 */
export function whenVisible(run: () => void): void {
  if (!document.hidden) {
    run();
    return;
  }
  const onVisible = () => {
    if (document.hidden) return;
    document.removeEventListener('visibilitychange', onVisible);
    run();
  };
  document.addEventListener('visibilitychange', onVisible);
}

interface RevealVars {
  trigger?: Element;
  delay?: number;
  /** 30-80ms between items keeps hierarchy without feeling slow. */
  stagger?: number;
  y?: number;
  duration?: number;
}

/**
 * The house entrance: fade up with a strong ease-out when scrolled into
 * view. Every section's reveal goes through this so timing and easing
 * stay one voice across the page. Call only inside motionReady contexts -
 * reduce-motion visitors must never reach it.
 */
export function revealUp(
  targets: gsap.TweenTarget,
  vars: RevealVars = {},
): void {
  gsap.from(targets, {
    autoAlpha: 0,
    y: vars.y ?? 30,
    duration: vars.duration ?? 0.85,
    ease: EASE,
    stagger: vars.stagger ?? 0,
    delay: vars.delay ?? 0,
    scrollTrigger: vars.trigger
      ? { trigger: vars.trigger, start: REVEAL_START }
      : undefined,
  });
}

/** Shared scramble-reveal for section labels and headings (SplitText). */
export function scrambleIn(
  target: Element,
  opts: { trigger?: Element; delay?: number } = {},
): void {
  // 'words,chars' nests chars inside word wrappers - chars alone would let
  // text wrap mid-word ("A / FTERMARKET") once split into divs.
  const split = new SplitText(target, { type: 'words,chars' });
  const chars = split.chars;
  const GLYPHS = '/\\|<>[]{}#$%&@=+*';
  const finals = chars.map((c) => c.textContent ?? '');

  gsap.fromTo(
    chars,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.02,
      stagger: 0.03,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger
        ? { trigger: opts.trigger, start: REVEAL_START }
        : undefined,
      onStart: () => {
        // The glyph timers must not run while the tab is hidden - GSAP's
        // clock freezes there, and wall-clock intervals would desync and
        // leave labels stuck mid-scramble.
        whenVisible(() => {
          chars.forEach((char, i) => {
            let ticks = 0;
            const max = 3 + Math.round(Math.random() * 4);
            const interval = setInterval(() => {
              char.textContent =
                ticks >= max
                  ? finals[i]
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              if (ticks >= max) clearInterval(interval);
              ticks += 1;
            }, 28 + i * 2);
          });
        });
      },
    },
  );
}

/**
 * Scroll-lit statement: words start muted and light up to navy as the
 * reader reaches them. `scrub` ties the lighting to the scroll position
 * (desktop); without it the words light once on entry (mobile). Call only
 * inside motionReady contexts.
 */
export function lightWords(target: Element, opts: { scrub?: boolean } = {}): void {
  const split = new SplitText(target, { type: 'words' });
  const muted = { color: 'rgba(103, 120, 141, 0.35)' };
  if (opts.scrub) {
    gsap.fromTo(split.words, muted, {
      color: 'var(--navy)',
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top 72%',
        end: 'bottom 45%',
        scrub: 0.4,
      },
    });
    return;
  }
  gsap.fromTo(split.words, muted, {
    color: 'var(--navy)',
    stagger: 0.04,
    duration: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: target, start: REVEAL_START },
  });
}
