/**
 * Use whitelist of env vars, causing tsc to fail if an ENV var is not referenced here
 */

// declare const process: { env: EnvVars };
declare namespace NodeJS {
  export interface ProcessEnv {
    COOKIE_SIGNING_KEY: string;
    COOKIE_ENCRYPTION_KEY: string;
    TWITTER_API_KEY: string;
    TWITTER_API_SECRET: string;
    TWITTER_REDIRECT_URL: string;
  }
}

/**
 * Hacks/workarounds for missing type definitions
 */
declare module 'cookie-encrypter';
