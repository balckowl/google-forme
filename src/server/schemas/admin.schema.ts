import z from "zod";

const featureFlagsSchema = z.object({
  isFormeBoldness: z.boolean(),
  isFormeExecution: z.boolean(),
  isFormeHumor: z.boolean(),
  isFormeCreativity: z.boolean(),
  isFormePresentation: z.boolean(),
});

export const formeBoldnessInput = featureFlagsSchema.pick({
  isFormeBoldness: true,
});

export const formeExecutionInput = featureFlagsSchema.pick({
  isFormeExecution: true,
});

export const formeHumorInput = featureFlagsSchema.pick({
  isFormeHumor: true,
});

export const formeCreativityInput = featureFlagsSchema.pick({
  isFormeCreativity: true,
});

export const formePresentationInput = featureFlagsSchema.pick({
  isFormePresentation: true,
});
