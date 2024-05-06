export const envConfig = () => ({
  env: process.env.NODE_ENV,
  apiVersion: process.env.API_VERSION,
  port: parseInt(process.env.PORT, 10) || 3001,
  appUrl: process.env.APP_URL || 'http://localhost:3001',
  jwt: {
    secret: process.env.JWT_SECRET || '9f8d2e207e45a8deadb4cff8e',
    expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
  },
  db: {
    url:
      process.env.DB_URL ||
      'mongodb://mongo:mongo@localhost:27017/spotify-clone?authSource=admin',
  },
  openapiPath: process.env.OPENAPI_PATH || './openapi',
  tsPostProcessFile:
    process.env.TS_POST_PROCESS_FILE ||
    '"/usr/local/share/npm-global/bin/prettier --write"',
});
