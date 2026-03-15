export function parseArrayFromString(fallback: string[], value?: string) {
    if (!value) return fallback;
    return value.split(',');
}
