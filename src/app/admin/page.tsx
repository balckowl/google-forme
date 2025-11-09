import AdminWrapper from "../components/AdminWrapper";
import { hono } from "../lib/hono-client";

export default async function Page() {
  const res = await hono.api.allFlags.$get();

  if(res.status !== 200){
    throw Error("何かの問題が発生しました。")
  }

  const flags = await res.json();

  // const flags: FeatureFlags = {
  //   isFormeBoldness: true,
  //   isFormeCreativity: true,
  //   isFormeExecution: true,
  //   isFormeHumor: true,
  //   isFormePresentation: true,
  // };

  return <AdminWrapper flags={flags} />;
}
