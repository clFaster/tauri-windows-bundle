function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function jsonMergePatch<T>(target: T, patch: unknown): T {
  if (!isObject(patch)) {
    return patch as T;
  }

  const result: Record<string, unknown> = isObject(target) ? { ...target } : {};

  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete result[key];
    } else {
      result[key] = jsonMergePatch(result[key], value);
    }
  }

  return result as T;
}
