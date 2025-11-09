import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { db } from "@/db";
import { featureFlags } from "@/db/schema";
import {
  formeBoldnessInput,
  formeCreativityInput,
  formeExecutionInput,
  formeHumorInput,
  formePresentationInput,
} from "../schemas/admin.schema";

export const publicRoutes = new Hono()
  .put(
    "/isFormeBoldness",
    zValidator("json", formeBoldnessInput),
    async (c) => {
      const { isFormeBoldness } = c.req.valid("json");
      await db.update(featureFlags).set({ isFormeBoldness });
      return c.json(
        {
          message: "update success",
        },
        200,
      );
    },
  )
  .put(
    "/isFormeExecution",
    zValidator("json", formeExecutionInput),
    async (c) => {
      const { isFormeExecution } = c.req.valid("json");
      await db.update(featureFlags).set({ isFormeExecution });
      return c.json(
        {
          message: "update success",
        },
        200,
      );
    },
  )
  .put("/isFormeHumor", zValidator("json", formeHumorInput), async (c) => {
    const { isFormeHumor } = c.req.valid("json");
    await db.update(featureFlags).set({ isFormeHumor });
    return c.json(
      {
        message: "update success",
      },
      200,
    );
  })
  .put(
    "/isFormeCreativity",
    zValidator("json", formeCreativityInput),
    async (c) => {
      const { isFormeCreativity } = c.req.valid("json");
      await db.update(featureFlags).set({ isFormeCreativity });
      return c.json(
        {
          message: "update success",
        },
        200,
      );
    },
  )
  .put(
    "/isFormePresentation",
    zValidator("json", formePresentationInput),
    async (c) => {
      const { isFormePresentation } = c.req.valid("json");
      await db.update(featureFlags).set({ isFormePresentation });
      return c.json(
        {
          message: "update success",
        },
        200,
      );
    },
  )
  .get(
    '/allFlags',
    async(c) => {
        const allFlags = await db.query.featureFlags.findMany();
        c.json(allFlags[0],200)
    }
  )
  
