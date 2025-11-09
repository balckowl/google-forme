import {boolean, pgTable} from "drizzle-orm/pg-core";

export const featureFlags = pgTable("feature_flags", {
  isFormeBoldness:boolean("is_forme_boldness").default(false).notNull(),
  isFormeExecution: boolean("is_forme_execution").default(false).notNull(),
  isFormeHumor:boolean("is_forme_humor").default(false).notNull(),
  isFormeCreativity:boolean("is_forme_creativity").default(false).notNull(),
  isFormePresentation:boolean("is_forme_presentation").default(false).notNull(),
});
