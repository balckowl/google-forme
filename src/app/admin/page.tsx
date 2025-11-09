import AdminWrapper from "../components/AdminWrapper";
import { hono } from "../lib/hono-client";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const res = await hono.api.allflags.$get();

  if (res.status !== 200) {
    throw Error("何かの問題が発生しました。")
  }

  const flags = await res.json();

  return <AdminWrapper flags={flags} />;
}
