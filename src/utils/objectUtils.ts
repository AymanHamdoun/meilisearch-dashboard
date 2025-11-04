/**
 * Format a value for display in UI
 *
 * @example
 * formatValue(null) // returns "null"
 * formatValue(true) // returns "true"
 * formatValue("hello") // returns "hello"
 * formatValue("") // returns '""'
 * formatValue(42) // returns "42"
 * formatValue([1, 2, 3]) // returns "1, 2, 3"
 * formatValue([1, 2, 3, 4, 5]) // returns "1, 2, 3, ... (5 items)"
 * formatValue({foo: "bar", baz: 42}) // returns "foo: bar, baz: 42"
 * formatValue({a: 1, b: 2, c: 3, d: 4}) // returns "{a, b, ...}"
 */
export const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'string') return value || '""';
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) {
        if (value.length === 0) return 'empty list';
        if (value.length <= 3) {
            return value.map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(', ');
        }
        return `${value.slice(0, 3).map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(', ')}, ... (${value.length} items)`;
    }
    if (typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 0) return 'empty object';
        // For complex objects, show a simplified representation
        if (keys.length <= 2) {
            return keys.map(k => `${k}: ${formatValue(value[k])}`).join(', ');
        }
        return `{${keys.slice(0, 2).join(', ')}, ...}`;
    }
    return String(value);
};

/**
 * Get differences between two objects
 * Returns an array of changes with field paths and old/new values
 *
 * @example
 * const original = {
 *   name: "John",
 *   age: 30,
 *   settings: { theme: "light", notifications: true }
 * };
 *
 * const modified = {
 *   name: "Jane",
 *   age: 30,
 *   settings: { theme: "dark", notifications: true }
 * };
 *
 * getDifferences(original, modified);
 * // returns [
 * //   { field: "name", original: "John", modified: "Jane" },
 * //   { field: "settings.theme", original: "light", modified: "dark" }
 * // ]
 */
export const getDifferences = (original: any, modified: any): { field: string; original: any; modified: any }[] => {
    const changes: { field: string; original: any; modified: any }[] = [];

    // Helper function to recursively compare and flatten nested objects
    const compareValues = (path: string, originalVal: any, modifiedVal: any) => {
        const originalStr = JSON.stringify(originalVal);
        const modifiedStr = JSON.stringify(modifiedVal);

        if (originalStr !== modifiedStr) {
            // Handle nested objects
            if (typeof originalVal === 'object' && typeof modifiedVal === 'object' &&
                originalVal !== null && modifiedVal !== null &&
                !Array.isArray(originalVal) && !Array.isArray(modifiedVal)) {

                // Get all keys from both objects
                const allKeys = new Set([...Object.keys(originalVal), ...Object.keys(modifiedVal)]);

                allKeys.forEach(key => {
                    const newPath = path ? `${path}.${key}` : key;
                    compareValues(newPath, originalVal[key], modifiedVal[key]);
                });
            } else {
                // For primitive values, arrays, or when structure changes
                changes.push({
                    field: path,
                    original: originalVal,
                    modified: modifiedVal
                });
            }
        }
    };

    // Compare each top-level field
    Object.keys(modified).forEach(key => {
        const originalValue = original[key];
        const modifiedValue = modified[key];
        compareValues(key, originalValue, modifiedValue);
    });

    return changes;
};