/**
 * Recursively transforms the keys of an object (or array of objects)
 * using the provided transformer function.
 *
 * @template T - The type of the input object.
 * @param {T} obj - The object (or array) whose keys should be transformed.
 * @param {(key: string) => string} transformer - A function that takes a key and returns the transformed key.
 * @returns {any} A new object (or array) with transformed keys. The values are preserved.
 *
 * @example
 * transformKeys({ first_name: "John" }, camelCase); // => { firstName: "John" }
 */
export function transformKeys<T>(
  obj: T,
  transformer: (key: string) => string,
): any {
  if (Array.isArray(obj))
    return obj.map((item) => transformKeys(item, transformer));

  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[transformer(key)] = value;
      return acc;
    }, {} as any);
  }

  return obj;
}
