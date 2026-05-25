"use client";

import { useEffect } from "react";
import { PUBLIC_BUILD_ID, PUBLIC_BUILD_TIME } from "@/lib/build-info";

export function BuildMarker() {
  useEffect(() => {
    console.info(
      `[LT Protect Formation] build=${PUBLIC_BUILD_ID} built=${PUBLIC_BUILD_TIME || "unknown"}`,
    );
  }, []);

  return (
    <span
      id="site-build-marker"
      data-build-id={PUBLIC_BUILD_ID}
      data-build-time={PUBLIC_BUILD_TIME}
      hidden
      aria-hidden="true"
    />
  );
}
