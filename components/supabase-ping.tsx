"use client";

import { useEffect } from "react";

export function SupabasePing() {
  useEffect(() => {
    fetch("/api/ping").catch(() => {});
  }, []);

  return null;
}
