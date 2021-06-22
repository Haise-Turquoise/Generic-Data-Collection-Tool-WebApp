export const host =
  process.env.NODE_ENV === 'production' ? process.env.PROD_SERVER : process.env.DEV_SERVER;
