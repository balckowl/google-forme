"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  CloudCheck,
  Mail,
  SendHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { RequiredMark } from "./components/RequiredMark";
import {
  defaultValues,
  type FormValues,
  formSchema,
  radioQuestions,
  ratingOptions,
} from "./constants/form";
import {
  HAND_PRESS_DELTA,
  useHandGuidedBoldness,
} from "./hooks/useHandGuidedBoldness";
import { useMousePointerAnimation } from "./hooks/useMousePointerAnimation";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer } from "lucide-react";

export default function Page() {
  const [lastSubmit, setLastSubmit] = useState<FormValues | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    boldnessFiveRef,
    handleBoldnessOverride,
    handEntryTransform,
    handInPlace,
    handPosition,
    handPressing,
    isBlockingInteractions,
    tapRipplePosition,
  } = useHandGuidedBoldness({ setValue });

   const {
    button5Ref,
    triggerAnimation,
    controls,
    isVisible,       
    isBlockingInteractions: isPointerBlocking,
  } = useMousePointerAnimation({
    setValue,                       
    fieldName: "execution",       
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLastSubmit(values);
    reset(values);
  };

  return (
    <main className="min-h-screen bg-[#ede7f6] pb-16 pt-8">
      {isBlockingInteractions ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 cursor-not-allowed bg-transparent"
        />
      ) : null}
      {isPointerBlocking ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 cursor-not-allowed bg-transparent"
        />
      ) : null}
      {tapRipplePosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed"
          style={{
            top: `${tapRipplePosition.top}px`,
            left: `${tapRipplePosition.left}px`,
            zIndex: 45,
          }}
        >
          <span className="tap-pulse" />
        </div>
      ) : null}
      {handPosition ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 drop-shadow-2xl"
          style={{
            top: `${handPosition.top}px`,
            left: `${handPosition.left}px`,
            transform: `${
              handInPlace ? "translate3d(0, 0, 0)" : handEntryTransform
            }${
              handPressing
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
      <AnimatePresence>
        {isVisible && ( 
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
            <MousePointer size={24} color="#0078d4" style={{ filter: 'drop-shadow(0 0 3px #fff)' }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-3 w-full bg-[#673ab7]" />
          <div className="space-y-6 px-8 pb-8 pt-6">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold text-[#202124]">
                Maximally Steal-A-Thon Judging Form
              </h1>
              <p className="text-base text-[#5f6368]">
                This is a dummy form for the Maximally Steal-A-Thon judging.
                Please rate it on a scale of 1 to 5.
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
            <p className="text-sm font-semibold text-[#d93025]">
              * Indicates required question
            </p>
          </div>
        </section>

        {lastSubmit ? (
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-[#202124] shadow">
            <CheckCircle2 className="text-[#188038]" size={18} />
            <span>Thanks {lastSubmit.name}! フォームを送信しました。</span>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <article
            className={`rounded-2xl border bg-white p-6 ${
              errors.name ? "border-[#d93025]" : "border-[#dadce0]"
            }`}
          >
            <label
              className="flex items-center text-base font-semibold text-[#202124]"
              htmlFor="name"
            >
              What is your name ?<RequiredMark />
            </label>
            <input
              className={`mt-4 w-full border-0 border-b-2 bg-transparent px-0 py-2 text-lg text-[#202124] focus:border-b-[#673ab7] focus:outline-none ${
                errors.name ? "border-b-[#d93025]" : "border-b-[#dadce0]"
              }`}
              id="name"
              type="text"
              placeholder="Enter your answer"
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
              className={`rounded-2xl border bg-white p-6 ${
                errors[question.name] ? "border-[#d93025]" : "border-[#dadce0]"
              }`}
            >
              <div className="flex items-center text-base font-semibold text-[#202124]">
                {question.label}
                <RequiredMark />
              </div>
              <p className="mt-1 text-sm text-[#5f6368]">{question.helper}</p>
              <div className="mt-4 space-y-3">
                {ratingOptions.map((option) => {
                  const registerProps =
                    question.name === "boldness"
                      ? register(question.name, {
                          onChange: handleBoldnessOverride,
                        })
                      : register(question.name);

                    question.name === "execution"
                      ? register(question.name, {
                          onChange: triggerAnimation,
                        })
                      : register(question.name);

                  return (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 text-[#202124]"
                    >
                      <input
                        className={`h-4 w-4 border-2 text-[#673ab7] focus:ring-[#673ab7] ${
                          errors[question.name]
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
                          else if (
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
            className={`rounded-2xl border bg-white p-6 ${
              errors.comment ? "border-[#d93025]" : "border-[#dadce0]"
            }`}
          >
            <label
              className="flex items-center text-base font-semibold text-[#202124]"
              htmlFor="comment"
            >
              Comment
              <RequiredMark />
            </label>
            <input
              className={`mt-4 w-full border-0 border-b-2 bg-transparent px-0 py-2 text-lg text-[#202124] focus:border-b-[#673ab7] focus:outline-none ${
                errors.comment ? "border-b-[#d93025]" : "border-b-[#dadce0]"
              }`}
              id="comment"
              type="text"
              placeholder="Enter your answer"
              {...register("comment")}
            />
            {errors.comment ? (
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[#d93025]">
                <AlertCircle size={16} />
                <span>This is a required question</span>
              </p>
            ) : null}
          </article>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5">
            <button
              className="inline-flex items-center gap-2 rounded bg-[#673ab7] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5e35b1] disabled:cursor-progress disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              <SendHorizontal size={16} />
              {isSubmitting ? "Submitting…" : "Submit"}
            </button>
            <button
              className="text-sm font-semibold text-[#673ab7]"
              type="button"
              onClick={() => reset(defaultValues)}
            >
              Clear form
            </button>
          </div>
        </form>

        <footer className="space-y-4 rounded-2xl bg-transparent px-4 py-6 text-center text-xs text-[#5f6368]">
          <p>Never submit passwords through Google Forms.</p>
          <p>
            This content is neither created nor endorsed by Google.
            <a className="px-1 text-[#1a73e8]" href="/">
              Report abuse
            </a>
            -
            <a className="px-1 text-[#1a73e8]" href="/">
              Terms of Service
            </a>
            -
            <a className="px-1 text-[#1a73e8]" href="/">
              Privacy Policy
            </a>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[#5f6368]">
            <span>This form was created using</span>
            <span className="font-semibold text-[#673ab7]">Google Forms</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
