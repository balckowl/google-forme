"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import { type FormValues, ratingScale } from "../constants/form";

type RatingValue = (typeof ratingScale)[number];

type UsePresentationAutoCountParams = {
  setValue: UseFormSetValue<FormValues>;
};

const ASCENDING_VALUES = [...ratingScale].reverse();
const COUNT_FRAME_MS = 120;
const RIPPLE_DURATION_MS = 900;

type PresentationRefs = Record<RatingValue, HTMLInputElement | null>;

const buildInitialRefs = (): PresentationRefs =>
  ratingScale.reduce((acc, rating) => {
    acc[rating] = null;
    return acc;
  }, {} as PresentationRefs);

type TapRipplePosition = {
  top: number;
  left: number;
};

export function usePresentationAutoCount({
  setValue,
}: UsePresentationAutoCountParams) {
  const [isBlockingInteractions, setIsBlockingInteractions] = useState(false);
  const [tapRipplePosition, setTapRipplePosition] =
    useState<TapRipplePosition | null>(null);
  const isAutoCountingRef = useRef(false);
  const optionRefs = useRef<PresentationRefs>(buildInitialRefs());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!isBlockingInteractions) {
      return;
    }

    const preventDefault = (event: Event) => {
      event.preventDefault();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("wheel", preventDefault, { passive: false });
    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("wheel", preventDefault);
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isBlockingInteractions]);

  const handlePresentationOverride = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedValue = event.target.value as RatingValue;

      if (selectedValue === "5" || isAutoCountingRef.current) {
        return;
      }

      clearTimers();
      isAutoCountingRef.current = true;
      setIsBlockingInteractions(true);

      const startIndex = ASCENDING_VALUES.indexOf(selectedValue);
      const animationSequence =
        startIndex >= 0 ? ASCENDING_VALUES.slice(startIndex) : ASCENDING_VALUES;

      if (animationSequence.length === 0) {
        isAutoCountingRef.current = false;
        setIsBlockingInteractions(false);
        return;
      }

      let stepIndex = 0;

      const runFrame = () => {
        const value = animationSequence[stepIndex];
        setValue("presentation", value, {
          shouldDirty: value === "5",
          shouldTouch: value === "5",
        });
        const node = optionRefs.current[value];
        if (node) {
          node.checked = true;
        }

        stepIndex += 1;
        const isFinalValue = value === "5";

        if (isFinalValue) {
          if (node) {
            const rect = node.getBoundingClientRect();
            setTapRipplePosition({
              top: rect.top + rect.height / 2,
              left: rect.left + rect.width / 2,
            });
          }
          const rippleCleanupTimer = setTimeout(() => {
            setTapRipplePosition(null);
          }, RIPPLE_DURATION_MS);
          const releaseTimer = setTimeout(() => {
            isAutoCountingRef.current = false;
            setIsBlockingInteractions(false);
          }, RIPPLE_DURATION_MS);
          timersRef.current.push(rippleCleanupTimer, releaseTimer);
          return;
        }

        if (stepIndex < animationSequence.length) {
          const timerId = setTimeout(runFrame, COUNT_FRAME_MS);
          timersRef.current.push(timerId);
        }
      };

      runFrame();
    },
    [clearTimers, setValue],
  );

  const registerPresentationRef = useCallback(
    (value: RatingValue, node: HTMLInputElement | null) => {
      optionRefs.current[value] = node;
    },
    [],
  );

  return {
    handlePresentationOverride,
    isBlockingInteractions,
    registerPresentationRef,
    tapRipplePosition,
  } as const;
}
