export const envConfig = () => ({
  env: process.env.NODE_ENV,
  apiVersion: process.env.API_VERSION,
  port: parseInt(process.env.PORT, 10) || 3001,
  jwt: {
    secret: process.env.JWT_SECRET || '9f8d2e207e45a8deadb4cff8e',
    expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
  },
  db: {
    type: process.env.DB_TYPE || 'mongo',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 27017,
    name: process.env.DB_NAME || 'spotify-clone',
    username: process.env.DB_USERNAME || 'mongo',
    password: process.env.DB_PASSWORD || 'mongo',
    url:
      process.env.DB_URL ||
      'mongodb://mongo:mongo@localhost:27017/spotify-clone?authSource=admin',
  },
  openapiPath: process.env.OPENAPI_PATH || './openapi',
  tsPostProcessFile:
    process.env.TS_POST_PROCESS_FILE ||
    '"/usr/local/share/npm-global/bin/prettier --write"',
});
