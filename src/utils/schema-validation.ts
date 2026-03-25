import { z } from 'zod';

const hasVar = (val: unknown): val is string =>
  typeof val === "string" && /\{\{.*?\}\}/.test(val);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getValueAtPath(obj: any, path: PropertyKey[]) {
  return path.reduce((acc, key) => acc?.[key], obj);
}

export function validateSkippingVars(schema: z.ZodType, data: Record<string, unknown>): z.ZodSafeParseResult<unknown> {
  const result = schema.safeParse(data);

  if (result.success) return result;

  const filteredErrors = result.error.issues.filter((err) => {
    const value = getValueAtPath(data, err.path);

    return !hasVar(value);
  });

  if (filteredErrors.length === 0) {
    return { success: true, data };
  }

  return {
    success: false,
    error: {
      ...result.error,
      issues: filteredErrors,
    },
  };
}