function isObject(obj: unknown): obj is Record<string, unknown> {
  return !!(obj && typeof obj === "object" && !Array.isArray(obj));
}

export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const result = { ...target };

  for (const key in source) {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}