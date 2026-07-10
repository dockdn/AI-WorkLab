type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 6;

const buckets = new Map<string, number[]>();

// This in-memory limiter is acceptable for local development and a single server instance.
// It is not sufficient for multi-instance production deployment and should be replaced with
// a shared store such as Redis or a hosted rate-limit service before scaling.
export function evaluateRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key) ?? [];
  const recent = existing.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.max(1, Math.ceil((WINDOW_MS - (now - recent[0])) / 1000));
    buckets.set(key, recent);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  buckets.set(key, recent);
  return { allowed: true };
}

export function getRateLimitKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const candidate = forwarded?.split(",")[0]?.trim() || realIp?.trim() || "anonymous";
  return `prompt-evaluation:${candidate}`;
}

export function resetEvaluationRateLimiter() {
  buckets.clear();
}
