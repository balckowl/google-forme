import { Hono } from "hono";
import { publicRoutes } from "./routes/public.route";

export const app = new Hono().basePath("/api");
export const pub = app.route("/", publicRoutes);
