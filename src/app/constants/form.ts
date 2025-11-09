import type { DefaultValues } from "react-hook-form";
import { z } from "zod";

export const ratingScale = ["5", "4", "3", "2", "1"] as const;

export const requiredMessage = "この質問は必須です";

export const formSchema = z.object({
  name: z.string().min(1, requiredMessage),
  boldness: z.enum(ratingScale, { message: requiredMessage }),
  execution: z.enum(ratingScale, { message: requiredMessage }),
  humor: z.enum(ratingScale, { message: requiredMessage }),
  creativity: z.enum(ratingScale, { message: requiredMessage }),
  presentation: z.enum(ratingScale, { message: requiredMessage }),
  comment: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export const radioQuestions = [
  {
    name: "boldness",
    label: "Boldness of Theft",
    helper: "Did this team snatch that idea with savage confidence?",
  },
  {
    name: "execution",
    label: "Execution & Improvement",
    helper: "They stole it, but did they glow-up the stolen goods?",
  },
  {
    name: "humor",
    label: "Humor / Branding",
    helper: "Does this project make you LOL and stick in your head?",
  },
  {
    name: "creativity",
    label: "Creativity in Rebranding",
    helper: "Did this team flip the script so it feels fresh, not recycled?",
  },
  {
    name: "presentation",
    label: "Presentation",
    helper: "Did this team sell it like pros?",
  },
] as const satisfies ReadonlyArray<{
  name: keyof Pick<
    FormValues,
    "boldness" | "execution" | "humor" | "creativity" | "presentation"
  >;
  label: string;
  helper: string;
}>;

export const ratingOptions = ratingScale.map((value) => ({
  value,
  label: value,
}));

export const defaultValues: DefaultValues<FormValues> = {
  name: "",
  boldness: undefined,
  execution: undefined,
  humor: undefined,
  creativity: undefined,
  presentation: undefined,
  comment: "",
};
