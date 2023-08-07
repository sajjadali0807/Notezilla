import { router } from "next/router";
import Login from "./auth/login";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    router.push("auth/login");
  }, []);
  return <></>;
}
