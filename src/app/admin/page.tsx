import AdminWrapper from "../components/AdminWrapper";
import { hono } from "../lib/hono-client";

export default async function Page() {
  const res = await hono.api.allFlags.$get();
  const flags = await res.json();

  return <AdminWrapper flags={flags} />;
}
