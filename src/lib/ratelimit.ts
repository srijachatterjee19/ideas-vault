const WINDOW_MS = 60_000;  // 1 minute
const MAX_ACTIONS = 20;    

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function hit(key: string) {
  const now = Date.now();
  const e = buckets.get(key);
  if (!e || e.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ACTIONS - 1 };
  }
  if (e.count >= MAX_ACTIONS) {
    return { allowed: false, retryInMs: e.resetAt - now };
  }
  e.count++;
  return { allowed: true, remaining: MAX_ACTIONS - e.count };
}
