// Production-safe logger utility
// Only logs in development, silently ignores in production

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, but sanitize in production
    if (isDev) {
      console.error(...args);
    } else {
      // In production, log only the message without stack traces
      const sanitized = args.map(arg => 
        arg instanceof Error ? arg.message : arg
      );
      console.error('[Error]', ...sanitized);
    }
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
};

export default logger;
