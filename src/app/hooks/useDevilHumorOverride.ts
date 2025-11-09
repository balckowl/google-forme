"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { FormValues, ratingScale } from "../constants/form";

type DevilPosition = {
  top: number;
  left: number;
};

type TapRipplePosition = {
  top: number;
  left: number;
};

type DevilImageVariant = "before" | "after";

type UseDevilHumorOverrideParams = {
  setValue: UseFormSetValue<FormValues>;
};

const DEVIL_OFFSET = {
  x: 300,
  yRatio: 0,
};

export function useDevilHumorOverride({
  setValue,
}: UseDevilHumorOverrideParams) {
  const [devilPosition, setDevilPosition] = useState<DevilPosition | null>(
    null,
  );
  const [devilImage, setDevilImage] = useState<DevilImageVariant>("before");
  const [isBlockingInteractions, setIsBlockingInteractions] = useState(false);
  const [tapRipplePosition, setTapRipplePosition] =
    useState<TapRipplePosition | null>(null);
  const humorQuestionRef = useRef<HTMLDivElement | null>(null);
  const humorFiveRef = useRef<HTMLInputElement | null>(null);
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

  const updateDevilPosition = useCallback(() => {
    const rect = humorQuestionRef.current?.getBoundingClientRect();
    if (!rect) {
      return null;
    }

    const nextPosition: DevilPosition = {
      top: rect.top + rect.height * DEVIL_OFFSET.yRatio,
      left: rect.left - DEVIL_OFFSET.x,
    };
    setDevilPosition(nextPosition);
    return nextPosition;
  }, []);

  const handleHumorOverride = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedValue = event.target.value as (typeof ratingScale)[number];

      if (selectedValue === "5" || isBlockingInteractions) {
        return;
      }

      setIsBlockingInteractions(true);
      setDevilImage("before");

      const position = updateDevilPosition();
      if (!position) {
        setValue("humor", "5");
        setIsBlockingInteractions(false);
        return;
      }

      const pointTimer = setTimeout(() => {
        setDevilImage("after");
        updateDevilPosition();
        const currentRect = humorFiveRef.current?.getBoundingClientRect();
        if (currentRect) {
          setTapRipplePosition({
            top: currentRect.top + currentRect.height / 2,
            left: currentRect.left + currentRect.width / 2,
          });
        }
        if (humorFiveRef.current) {
          humorFiveRef.current.click();
        } else {
          setValue("humor", "5");
        }
      }, 600);

      const hideTimer = setTimeout(() => {
        setDevilPosition(null);
        setDevilImage("before");
        setTapRipplePosition(null);
        setIsBlockingInteractions(false);
      }, 1200);

      const rippleHideTimer = setTimeout(() => {
        setTapRipplePosition(null);
      }, 900);

      timersRef.current.push(pointTimer, hideTimer, rippleHideTimer);
    },
    [isBlockingInteractions, setValue, updateDevilPosition],
  );

  return {
    devilImage,
    devilPosition,
    handleHumorOverride,
    humorFiveRef,
    humorQuestionRef,
    isBlockingInteractions,
    tapRipplePosition,
  } as const;
}
