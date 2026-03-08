import type { IMockTest } from "@/interface/mockTest.types";

// ─── Filter shape ───────────────────────────────────────────────────────────
export interface MockTestFilters {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Table row helpers ──────────────────────────────────────────────────────
export type MockTestRow = IMockTest;
