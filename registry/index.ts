import { hooks } from "./registry-hooks";
import type { Registry } from "./schema";

export const registry: Registry = [...hooks];
