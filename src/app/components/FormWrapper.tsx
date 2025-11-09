"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CloudCheck, Loader2, Mail, Pointer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { FeatureFlags } from "@/server/schemas/admin.schema";
import {
  defaultValues,
  type FormValues,
  formSchema,
  radioQuestions,
  ratingOptions,
} from "../constants/form";
import { useCreativeMeltdown } from "../hooks/useCreativeMeltdown";
import { useDevilHumorOverride } from "../hooks/useDevilHumorOverride";
import {
  HAND_PRESS_DELTA,
  useHandGuidedBoldness,
} from "../hooks/useHandGuidedBoldness";
import { useMousePointerAnimation } from "../hooks/useMousePointerAnimation";
import { usePresentationAutoCount } from "../hooks/usePresentationAutoCount";
import { RequiredMark } from "./RequiredMark";

export default function FormWrapper({ flags }: { flags: FeatureFlags }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    boldnessFiveRef,
    handleBoldnessOverride,
    handEntryTransform,
    handInPlace,
    handPosition,
    handPressing,
    isBlockingInteractions: isHandBlocking,
    tapRipplePosition: boldnessTapRipplePosition,
  } = useHandGuidedBoldness({ setValue });

  const {
    button5Ref,
    triggerAnimation,
    controls,
    isVisible,
    isBlockingInteractions: isPointerBlocking,
    tapRipplePosition: executionTapRipplePosition,
  } = useMousePointerAnimation({
    setValue,
    fieldName: "execution",
  });

  const {
    devilImage,
    devilPosition,
    handleHumorOverride,
    humorFiveRef,
    humorQuestionRef,
    isBlockingInteractions: isDevilBlocking,
    tapRipplePosition: devilTapRipplePosition,
  } = useDevilHumorOverride({ setValue });

  const {
    creativityFiveRef,
    handleCreativityOverride,
    isBlockingInteractions: isCreativityBlocking,
    meltingOption,
    tapRipplePosition: creativityTapRipplePosition,
  } = useCreativeMeltdown({ setValue });

  const {
    handlePresentationOverride,
    isBlockingInteractions: isPresentationBlocking,
    registerPresentationRef,
    tapRipplePosition: presentationTapRipplePosition,
  } = usePresentationAutoCount({ setValue });

  const {
    isFormeBoldness,
    isFormeExecution,
    isFormeHumor,
    isFormeCreativity,
    isFormePresentation,
  } = flags;

  const automationEnabledByField = {
    boldness: isFormeBoldness,
    execution: isFormeExecution,
    humor: isFormeHumor,
    creativity: isFormeCreativity,
    presentation: isFormePresentation,
  } as const;

  const isBlockingInteractions =
    (isFormeBoldness && isHandBlocking) ||
    (isFormeHumor && isDevilBlocking) ||
    (isFormeCreativity && isCreativityBlocking) ||
    (isFormePresentation && isPresentationBlocking);

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    reset();
    toast.success("Form submitted successfully.");
  };

  const values = watch();

  return (
    <main className="min-h-screen bg-[#ede7f6] pb-16 pt-8">
      <div aria-hidden style={{ display: "none" }}>
        {JSON.stringify(values)}
      </div>
      {isBlockingInteractions ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 cursor-not-allowed bg-transparent"
        />
      ) : null}
      {isFormeExecution && isPointerBlocking ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 cursor-not-allowed bg-transparent"
        />
      ) : null}
      {isFormeBoldness && boldnessTapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${boldnessTapRipplePosition.top}px`,
            left: `${boldnessTapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {isFormeExecution && executionTapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${executionTapRipplePosition.top}px`,
            left: `${executionTapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {isFormeHumor && devilTapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${devilTapRipplePosition.top}px`,
            left: `${devilTapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {isFormeCreativity && creativityTapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${creativityTapRipplePosition.top}px`,
            left: `${creativityTapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {isFormePresentation && presentationTapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${presentationTapRipplePosition.top}px`,
            left: `${presentationTapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {isFormeBoldness && handPosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 drop-shadow-2xl"
          style={{
            top: `${handPosition.top}px`,
            left: `${handPosition.left}px`,
            transform: `${handInPlace ? "translate3d(0, 0, 0)" : handEntryTransform
              }${handPressing
                ? ` translate3d(${HAND_PRESS_DELTA.x}px, ${HAND_PRESS_DELTA.y}px, 0) rotate(-6deg) scale(0.92)`
                : ""
              }`,
            transition: handPressing
              ? "transform 0.14s cubic-bezier(0.26, 0.08, 0.25, 1)"
              : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: handPressing
              ? "drop-shadow(0 6px 18px rgba(0,0,0,0.2))"
              : "drop-shadow(0 18px 32px rgba(0,0,0,0.25))",
          }}
        >
          <Image
            alt=""
            className="pointer-events-none w-auto select-none"
            draggable={false}
            src="/hand.PNG"
            width={2500}
            height={2500}
          />
        </div>
      ) : null}
      {isFormeHumor && devilPosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-40"
          style={{
            top: `${devilPosition.top}px`,
            left: `${devilPosition.left}px`,
          }}
        >
          <Image
            alt=""
            className="pointer-events-none w-auto select-none"
            draggable={false}
            height={300}
            src={
              devilImage === "before" ? "/devil-before.PNG" : "/devil-after.PNG"
            }
            width={300}
          />
        </div>
      ) : null}
      <AnimatePresence>
        {isFormeExecution && isVisible && (
          <motion.div
            key="mouse-pointer"
            style={{
              position: "fixed",
              zIndex: 9999,
              pointerEvents: "none",
              transformOrigin: "top left",
            }}
            animate={controls}
          >
            <Pointer
              size={24}
              color="black"
              fill="white"
              style={{ filter: "drop-shadow(0 0 3px #fff)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4">
        <section className="overflow-hidden rounded-xl bg-white">
          <div className="h-3 w-full bg-[#673ab7]" />
          <div className="space-y-5 px-8 pb-8 pt-6">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold text-[#202124]">
                Maximally Steal-A-Thon Judging Form
              </h1>
              <p className="text-base text-[#5f6368]">
                This is a dummy form for the Maximally Steal-A-Thon review.
                <br />
                Please rate it on a scale of 1 to 5, where 5 is the highest rating and 1 is the lowest.
              </p>
            </header>
            <div className="divide-y divide-[#dadce0] border-y border-[#dadce0] text-[#202124]">
              <div className="py-3 text-base font-semibold">
                example@gmail.com
                <button
                  className="pl-2 text-sm font-semibold text-[#1a73e8]"
                  type="button"
                >
                  Switch account
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm text-[#5f6368]">
                <div className="inline-flex items-center gap-2 font-medium">
                  <Mail className="text-[#5f6368]" size={16} />
                  <span>Not shared</span>
                </div>
                <div className="inline-flex items-center gap-2 font-medium">
                  <CloudCheck className="text-[#5f6368]" size={16} />
                  <span>Draft saved</span>
                </div>
              </div>
            </div>
            <button type="button">
              <Link
                href="/admin"
                className="inline-flex
                cursor-pointer 
                items-center 
                gap-2 rounded-xl bg-[#673ab7] px-6 py-2 text-sm font-semibold
                text-white transition
                hover:bg-[#5e35b1] disabled:cursor-progress 
                disabled:opacity-70"
              >
                <span>Go to setting</span>
              </Link>
            </button>
            <p className="text-sm font-semibold text-[#d93025]">
              * Indicates required question
            </p>
          </div>
        </section>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <article
            className={`rounded-xl border bg-white p-6 ${errors.name ? "border-[#d93025]" : "border-[#dadce0]"
              }`}
          >
            <label
              className="flex items-center text-base font-semibold text-[#202124]"
              htmlFor="name"
            >
              Your name
              <RequiredMark />
            </label>
            <input
              className={`mt-4 w-full border-0 border-b-2 bg-transparent px-0 py-2 text-lg text-[#202124] focus:border-b-[#673ab7] focus:outline-none ${errors.name ? "border-b-[#d93025]" : "border-b-[#dadce0]"
                }`}
              id="name"
              type="text"
              placeholder="Your answer"
              {...register("name")}
            />
            {errors.name ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#d93025]">
                <AlertCircle size={16} />
                <span>This is a required question</span>
              </p>
            ) : null}
          </article>

          {radioQuestions.map((question) => (
            <article
              key={question.name}
              className={`rounded-xl border bg-white p-6 ${errors[question.name] ? "border-[#d93025]" : "border-[#dadce0]"
                }`}
              ref={question.name === "humor" ? humorQuestionRef : undefined}
            >
              <div className="flex items-center text-base font-semibold text-[#202124]">
                {question.label}
                <RequiredMark />
              </div>
              <p className="mt-1 text-sm text-[#5f6368]">{question.helper}</p>
              <div className="mt-4 space-y-3">
                {ratingOptions.map((option) => {
                  const fieldName = question.name;
                  const automationEnabled = automationEnabledByField[fieldName];

                  const onChangeHandler = (() => {
                    if (!automationEnabled) {
                      return undefined;
                    }
                    if (fieldName === "boldness") {
                      return handleBoldnessOverride;
                    }
                    if (fieldName === "humor") {
                      return handleHumorOverride;
                    }
                    if (fieldName === "creativity") {
                      return handleCreativityOverride;
                    }
                    if (fieldName === "presentation") {
                      return handlePresentationOverride;
                    }
                    if (fieldName === "execution") {
                      return triggerAnimation;
                    }
                    return undefined;
                  })();

                  const registerProps = register(
                    fieldName,
                    onChangeHandler ? { onChange: onChangeHandler } : undefined,
                  );

                  const labelClassNames = [
                    "flex items-center gap-3 text-[#202124]",
                  ];
                  if (question.name === "creativity") {
                    labelClassNames.push("creativity-option");
                    if (meltingOption) {
                      if (option.value === meltingOption) {
                        labelClassNames.push("creativity-option--melting");
                      } else if (option.value !== "5") {
                        labelClassNames.push("creativity-option--fading");
                      }
                    }
                  }

                  return (
                    <label
                      key={option.value}
                      className={labelClassNames.join(" ")}
                    >
                      <input
                        className={`h-4 w-4 border-2 text-[#673ab7] focus:ring-[#673ab7] ${errors[question.name]
                          ? "border-[#d93025]"
                          : "border-[#5f6368]"
                          }`}
                        type="radio"
                        value={option.value}
                        {...registerProps}
                        ref={(node) => {
                          registerProps.ref(node);
                          if (
                            question.name === "boldness" &&
                            option.value === "5"
                          ) {
                            boldnessFiveRef.current = node;
                          }
                          if (
                            question.name === "humor" &&
                            option.value === "5"
                          ) {
                            humorFiveRef.current = node;
                          }
                          if (
                            question.name === "creativity" &&
                            option.value === "5"
                          ) {
                            creativityFiveRef.current = node;
                          }
                          if (question.name === "presentation") {
                            registerPresentationRef(option.value, node);
                          } else if (
                            question.name === "execution" &&
                            option.value === "5"
                          ) {
                            button5Ref.current = node;
                          }
                        }}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors[question.name] ? (
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#d93025]">
                  <AlertCircle size={16} />
                  <span>This is a required question</span>
                </p>
              ) : null}
            </article>
          ))}

          <article
            className={`rounded-xl border bg-white p-6 ${errors.comment ? "border-[#d93025]" : "border-[#dadce0]"
              }`}
          >
            <label
              className="flex items-center text-base font-semibold text-[#202124]"
              htmlFor="comment"
            >
              Additional comments
            </label>
            <input
              className={`mt-4 w-full border-0 border-b-2 bg-transparent px-0 py-2 text-lg text-[#202124] focus:border-b-[#673ab7] focus:outline-none ${errors.comment ? "border-b-[#d93025]" : "border-b-[#dadce0]"
                }`}
              id="comment"
              type="text"
              placeholder="Your answer"
              {...register("comment")}
            />
            {errors.comment ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#d93025]">
                <AlertCircle size={16} />
                <span>This is a required question</span>
              </p>
            ) : null}
          </article>

          <div className="flex items-center justify-between">
            <button
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#673ab7] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5e35b1] disabled:cursor-progress disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" size={14} />}
              Submit
            </button>
            <button
              className="text-sm cursor-pointer font-semibold text-[#673ab7]"
              type="button"
              onClick={() => reset()}
            >
              Clear form
            </button>
          </div>
        </form>

        <footer className="space-y-2 rounded-2xl bg-transparent px-4 py-8 text-center text-xs text-[#5f6368]">
          <p className="text-xs text-start font-medium leading-snug">
            Never submit passwords through Goodgle Forme.
          </p>
          <p className="text-xs leading-snug">
            This content is neither created nor endorsed by Goodgle Forme.{" "}
            <span className="text-[#202124]">-</span>{" "}
            <a className="font-medium text-[#5f6368] underline" href="/">
              Contact form owner
            </a>{" "}
            <span className="text-[#202124]">-</span>{" "}
            <a className="font-medium text-[#5f6368] underline" href="/">
              Terms of Service
            </a>{" "}
            <span className="text-[#202124]">-</span>{" "}
            <a className="font-medium text-[#5f6368] underline" href="/">
              Privacy Policy
            </a>
          </p>
          <p className="text-xs leading-snug">
            Does this form look suspicious?{" "}
            <a className="font-medium text-[#5f6368] underline" href="/">
              Report
            </a>
          </p>
          <div className="pt-1 text-2xl font-medium text-[#5f6368]">
            Goodgle Forme
          </div>
        </footer>
      </div>
    </main>
  );
}
