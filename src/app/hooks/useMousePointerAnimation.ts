import { useState, useRef, useCallback, useEffect } from "react";
import { useAnimation, animationControls } from "framer-motion";
import type { UseFormSetValue, FieldValues, Path } from "react-hook-form";
import { type FormValues } from "../constants/form";


const POINTER_OFFSET = {
  x: 15,
  y: -25,
};
// フックに渡す props の型
interface UseMousePointerAnimationParams {
  setValue: UseFormSetValue<FormValues>;
  fieldName: Path<FormValues>; 
}

// 登場パターンの定義
const entryPoints = [
  { x: "200vw", y: (targetY: number) => targetY }, // 右から
  { x: "-200vw", y: (targetY: number) => targetY }, // 左から
  { x: (targetX: number) => targetX, y: "200vh" }, // 下から
] as const;

export function useMousePointerAnimation({
  setValue,
  fieldName,
}: UseMousePointerAnimationParams) {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isVisible, setisVisible] = useState<boolean>(false);
  const [isBlockingInteractions, setisBlockingInteractions] = useState<boolean>(false);

  const button5Ref = useRef<HTMLInputElement | null>(null);
  const controls = useAnimation();
  const rippleCleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  useEffect(() => {
    if (!isBlockingInteractions) return;
    const preventDefault = (event: Event) => event.preventDefault();
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
      if (rippleCleanupTimerRef.current) {
        clearTimeout(rippleCleanupTimerRef.current);
      }
    };
  }, []);

  const triggerAnimation = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedValue = event.target.value;
      if (selectedValue === "5" || isAnimating) {
        return;
      }

      setIsAnimating(true);
      setisBlockingInteractions(true);

      if (!button5Ref.current) {
        setValue(fieldName, "5");
        setIsAnimating(false);
        setisBlockingInteractions(false);
        return;
      }

      const rect = button5Ref.current.getBoundingClientRect();
      const targetX = rect.left + POINTER_OFFSET.x; 
      const targetY = rect.top + POINTER_OFFSET.y;

      const randomEntryPoint = entryPoints[Math.floor(Math.random() * entryPoints.length)];
      const startX = typeof randomEntryPoint.x === 'function' ? randomEntryPoint.x(targetX) : randomEntryPoint.x;
      const startY = typeof randomEntryPoint.y === 'function' ? randomEntryPoint.y(targetY) : randomEntryPoint.y;
      const startPos = { x: startX, y: startY };
      
      setisVisible(true);
      await controls.start({ ...startPos, opacity: 1, scale: 1, transition: { duration: 0 } });
      
      await controls.start({
        x: targetX,
        y: targetY,
        transition: { type: "spring", stiffness: 400, damping: 30, duration: 0.65 }
      });

      await controls.start({
        scale: [1, 0.7, 1],
        transition: { duration: 0.45 }
      });

      

      button5Ref.current.click();
      await controls.start({
        opacity: 0,
        transition: { duration: 0.4 }
      });

      setisVisible(false);
      setIsAnimating(false);
      setisBlockingInteractions(false);

    }, [controls, isAnimating, setValue, fieldName]
  );

  return {
    button5Ref,
    triggerAnimation,
    controls,
    isVisible,       
    isBlockingInteractions,
  };
}