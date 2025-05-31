interface RateLimit {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Simple encryption/decryption using base64 and a key
const RATE_LIMIT_KEY = "rl_data_v1";
const ENCRYPTION_KEY = "goose_ai_rate_limit_2024";

// Simple XOR encryption for client-side obfuscation
function encrypt(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
    );
  }
  return btoa(result);
}

function decrypt(encrypted: string): string {
  try {
    const decoded = atob(encrypted);
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^
          ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return result;
  } catch {
    return "";
  }
}

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 20, // 20 requests per hour
  windowMs: 60 * 60 * 1000, // 1 hour
};

export function checkRateLimit(): RateLimitResult {
  const now = Date.now();

  // Get existing rate limit data
  const encryptedData = localStorage.getItem(RATE_LIMIT_KEY);
  let rateLimit: RateLimit = {
    count: 0,
    resetTime: now + RATE_LIMIT_CONFIG.windowMs,
  };

  if (encryptedData) {
    try {
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);
      rateLimit = parsedData;
    } catch {
      // Invalid data, reset
    }
  }

  // Check if window has expired
  if (now >= rateLimit.resetTime) {
    rateLimit = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  }

  // Check if request is allowed
  const allowed = rateLimit.count < RATE_LIMIT_CONFIG.maxRequests;
  const remaining = Math.max(
    0,
    RATE_LIMIT_CONFIG.maxRequests - rateLimit.count
  );

  return {
    allowed,
    remaining,
    resetTime: rateLimit.resetTime,
  };
}

export function incrementRateLimit(): void {
  const now = Date.now();

  // Get existing rate limit data
  const encryptedData = localStorage.getItem(RATE_LIMIT_KEY);
  let rateLimit: RateLimit = {
    count: 0,
    resetTime: now + RATE_LIMIT_CONFIG.windowMs,
  };

  if (encryptedData) {
    try {
      const decryptedData = decrypt(encryptedData);
      const parsedData = JSON.parse(decryptedData);
      rateLimit = parsedData;
    } catch {
      // Invalid data, reset
    }
  }

  // Check if window has expired
  if (now >= rateLimit.resetTime) {
    rateLimit = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
  } else {
    rateLimit.count += 1;
  }

  // Save encrypted data
  const encryptedData2 = encrypt(JSON.stringify(rateLimit));
  localStorage.setItem(RATE_LIMIT_KEY, encryptedData2);
}

export function getRateLimitResetTime(): Date {
  const encryptedData = localStorage.getItem(RATE_LIMIT_KEY);
  if (!encryptedData) {
    return new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs);
  }

  try {
    const decryptedData = decrypt(encryptedData);
    const parsedData = JSON.parse(decryptedData);
    return new Date(parsedData.resetTime);
  } catch {
    return new Date(Date.now() + RATE_LIMIT_CONFIG.windowMs);
  }
}
