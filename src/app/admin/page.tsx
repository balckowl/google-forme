import { db } from "@/db";
import AdminWrapper from "../components/AdminWrapper";

export default async function Page() {
  const allFlags = await db.query.featureFlags.findMany();
  return <AdminWrapper flags={allFlags[0]} />;
}
