import { db } from "@/db";
import FormWrapper from "./components/FormWrapper";

export default async function Page() {
  const allFlags = await db.query.featureFlags.findMany();
  return <FormWrapper flags={allFlags[0]} />;
}
