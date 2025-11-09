"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeatureFlags } from "@/server/schemas/admin.schema";
import { hono } from "../lib/hono-client";

const flagDefinitions = [
  { key: "isFormeBoldness", label: "is_forme_boldness" },
  { key: "isFormeExecution", label: "is_forme_execution" },
  { key: "isFormeHumor", label: "is_forme_humor" },
  { key: "isFormeCreativity", label: "is_forme_creativity" },
  { key: "isFormePresentation", label: "is_forme_presentation" },
] as const;

type FlagKey = (typeof flagDefinitions)[number]["key"];
type FlagState = Record<FlagKey, boolean>;

const deriveFlagState = (source: FeatureFlags): FlagState =>
  flagDefinitions.reduce((acc, flag) => {
    acc[flag.key] = source[flag.key];
    return acc;
  }, {} as FlagState);

const flagMutations: Record<FlagKey, (value: boolean) => Promise<Response>> = {
  isFormeBoldness: (value) =>
    hono.api.isFormeBoldness.$put({
      json: { isFormeBoldness: value },
    }),
  isFormeExecution: (value) =>
    hono.api.isFormeExecution.$put({
      json: { isFormeExecution: value },
    }),
  isFormeHumor: (value) =>
    hono.api.isFormeHumor.$put({
      json: { isFormeHumor: value },
    }),
  isFormeCreativity: (value) =>
    hono.api.isFormeCreativity.$put({
      json: { isFormeCreativity: value },
    }),
  isFormePresentation: (value) =>
    hono.api.isFormePresentation.$put({
      json: { isFormePresentation: value },
    }),
};

export default function AdminWrapper({
  flags: allFlags,
}: {
  flags: FeatureFlags;
}) {
  const [flags, setFlags] = useState<FlagState>(() =>
    deriveFlagState(allFlags),
  );

  useEffect(() => {
    setFlags(deriveFlagState(allFlags));
  }, [allFlags]);

  const sendFlagUpdate = useCallback(
    async (key: FlagKey, nextValue: boolean, previousValue: boolean) => {
      try {
        await flagMutations[key](nextValue);
        console.log(`[Admin] ${key}:`, nextValue);
      } catch (error) {
        console.error(`[Admin] Failed to update ${key}`, error);
        setFlags((prev) => ({ ...prev, [key]: previousValue }));
      }
    },
    [],
  );

  const handleToggle = useCallback(
    (key: FlagKey) => {
      setFlags((prev) => {
        const previousValue = prev[key];
        const nextValue = !previousValue;
        void sendFlagUpdate(key, nextValue, previousValue);
        return { ...prev, [key]: nextValue };
      });
    },
    [sendFlagUpdate],
  );

  return (
    <main className="min-h-screen bg-[#ede7f6] p-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-[#dadce0] bg-white p-8 shadow-sm">
        <header className="mb-6">
          <p className="text-lg font-semibold text-[#202124]">Feature Flags</p>
          <p className="text-sm text-[#5f6368]">
            Toggle each forme flag to preview the current state and sync with
            the API.
          </p>
        </header>
        <div className="flex flex-wrap gap-4">
          {flagDefinitions.map(({ key, label }) => {
            const isEnabled = flags[key];
            return (
              <article
                key={key}
                className="flex grow basis-64 items-center justify-between rounded-2xl border border-[#dadce0] px-4 py-3"
              >
                <span className="text-sm font-medium text-[#202124]">
                  {label}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={label}
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${isEnabled ? "bg-[#673ab7]" : "bg-[#ccd0d5]"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${isEnabled ? "translate-x-5" : "translate-x-1"}`}
                  />
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
