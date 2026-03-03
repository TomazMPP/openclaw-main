import { pt } from "./pt";

import type { config } from "../config";

export const translations: Record<
  (typeof config.locales)[number],
  typeof pt
> = {
  pt,
} as const;
