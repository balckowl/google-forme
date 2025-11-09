"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { FormValues, ratingScale } from "../constants/form";

type UseCreativeMeltdownParams = {
  setValue: UseFormSetValue<FormValues>;
};

type RatingValue = (typeof ratingScale)[number];

const MELT_DURATION_MS = 900;
const RESET_DURATION_MS = 1600;
const RIPPLE_DURATION_MS = 900;

type TapRipplePosition = {
  top: number;
  left: number;
};

export function useCreativeMeltdown({ setValue }: UseCreativeMeltdownParams) {
  const [meltingOption, setMeltingOption] = useState<RatingValue | null>(null);
  const [isBlockingInteractions, setIsBlockingInteractions] = useState(false);
  const [tapRipplePosition, setTapRipplePosition] =
    useState<TapRipplePosition | null>(null);
  const creativityFiveRef = useRef<HTMLInputElement | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => {
        clearTimeout(timerId);
      });
      timersRef.current = [];
    };
  }, []);

  const queueTimer = useCallback((callback: () => void, delay: number) => {
    const timerId = setTimeout(callback, delay);
    timersRef.current.push(timerId);
    return timerId;
  }, []);

  const clearQueuedTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => {
      clearTimeout(timerId);
    });
    timersRef.current = [];
  }, []);

  const handleCreativityOverride = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedValue = event.target.value as RatingValue;

      if (selectedValue === "5" || isBlockingInteractions) {
        return;
      }

      clearQueuedTimers();
      setIsBlockingInteractions(true);
      setMeltingOption(selectedValue);

      queueTimer(() => {
        const targetRect = creativityFiveRef.current?.getBoundingClientRect();
        if (targetRect) {
          setTapRipplePosition({
            top: targetRect.top + targetRect.height / 2,
            left: targetRect.left + targetRect.width / 2,
          });
          creativityFiveRef.current?.click();
        } else {
          setValue("creativity", "5");
        }
      }, MELT_DURATION_MS);

      queueTimer(() => {
        setTapRipplePosition(null);
      }, MELT_DURATION_MS + RIPPLE_DURATION_MS);

      queueTimer(() => {
        setMeltingOption(null);
        setIsBlockingInteractions(false);
      }, RESET_DURATION_MS);
    },
    [clearQueuedTimers, isBlockingInteractions, queueTimer, setValue],
  );

  return {
    creativityFiveRef,
    handleCreativityOverride,
    isBlockingInteractions,
    meltingOption,
    tapRipplePosition,
  } as const;
}
