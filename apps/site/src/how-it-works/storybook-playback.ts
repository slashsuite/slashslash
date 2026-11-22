import { useEffect, useRef, useState } from "react";
import { SCENE_DURATION_MS, STORYBOOK_SCENES } from "#/how-it-works/storybook-data";

export type StorybookPlayback = {
  index: number;
  isPlaying: boolean;
  stageAnimated: boolean;
  stagePaused: boolean;
  liveText: string;
  runKey: number;
  selectScene: (nextIndex: number) => void;
  togglePlay: () => void;
};

function useMotionAndVisibility(containerRef: { current: HTMLElement | null }): {
  osAllowsMotion: boolean;
  inView: boolean;
  hasEntered: boolean;
  tabVisible: boolean;
} {
  const [osAllowsMotion, setOsAllowsMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = (): void => setOsAllowsMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const syncVisibility = (): void => setTabVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (node === null) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first === undefined) return;
        setInView(first.isIntersecting);
        if (first.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return { osAllowsMotion, inView, hasEntered, tabVisible };
}

export function useStorybookPlayback(
  containerRef: { current: HTMLElement | null },
  sceneCount: number,
): StorybookPlayback {
  const { osAllowsMotion, inView, hasEntered, tabVisible } = useMotionAndVisibility(containerRef);
  const [index, setIndex] = useState(0);
  const [userPref, setUserPref] = useState<boolean | null>(null);
  const [userEverPlayed, setUserEverPlayed] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [runKey, setRunKey] = useState(0);
  const timerStateRef = useRef({ runKey: 0, remainingMs: SCENE_DURATION_MS });

  const isPlaying = userPref ?? osAllowsMotion;
  const running = isPlaying && inView && tabVisible;

  useEffect(() => {
    if (!running) return undefined;
    const remainingMs =
      timerStateRef.current.runKey === runKey ? timerStateRef.current.remainingMs : SCENE_DURATION_MS;
    timerStateRef.current = { runKey, remainingMs };

    const startedAt = Date.now();
    const waitMs = Math.max(50, remainingMs);
    const nextIndex = (index + 1) % sceneCount;
    const nextRun = runKey + 1;
    let completed = false;

    const timer = window.setTimeout(() => {
      completed = true;
      timerStateRef.current = { runKey: nextRun, remainingMs: SCENE_DURATION_MS };
      setIndex(nextIndex);
      setRunKey(nextRun);
    }, waitMs);

    return () => {
      window.clearTimeout(timer);
      if (!completed && timerStateRef.current.runKey === runKey) {
        const elapsed = Math.max(0, Date.now() - startedAt);
        timerStateRef.current = { runKey, remainingMs: Math.max(0, remainingMs - elapsed) };
      }
    };
  }, [running, index, sceneCount, runKey]);

  const selectScene = (nextIndex: number): void => {
    const wrapped = ((nextIndex % sceneCount) + sceneCount) % sceneCount;
    const target = STORYBOOK_SCENES[wrapped];
    setIndex(wrapped);
    setRunKey((prev) => prev + 1);
    if (target !== undefined) setLiveText(`Scene ${target.chapter} of ${sceneCount}: ${target.title}`);
  };

  const togglePlay = (): void => {
    const next = !isPlaying;
    setUserPref(next);
    if (next && !userEverPlayed) {
      setUserEverPlayed(true);
      if (!(osAllowsMotion && hasEntered)) {
        setRunKey((prev) => prev + 1);
      }
    }
  };

  const stageAnimated = userEverPlayed || (osAllowsMotion && hasEntered);
  return { index, isPlaying, stageAnimated, stagePaused: !running, liveText, runKey, selectScene, togglePlay };
}
