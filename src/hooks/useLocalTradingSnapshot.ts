"use client";

import { useSyncExternalStore } from "react";
import {
  getLocalTradingServerSnapshot,
  getLocalTradingSnapshot,
  subscribeLocalTradingStore,
} from "@/services/trading";

export function useLocalTradingSnapshot() {
  return useSyncExternalStore(
    subscribeLocalTradingStore,
    getLocalTradingSnapshot,
    getLocalTradingServerSnapshot,
  );
}
