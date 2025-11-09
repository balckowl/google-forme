import { hc } from "hono/client";
import { env } from "@/env.mjs";
import type { pub } from "@/server/hono";

type AppType = typeof pub;

export const hono = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
