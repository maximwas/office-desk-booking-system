declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DATABASE_URI: string;
      DATABASE_NAME: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      JWT_SECRET: string;
      JWT_TOKEN_TIME: string;
      JWT_REFRESH_TOKEN_TIME: string;
      NODE_ENV: 'develop' | 'stage' | 'production';
    }
  }
}

export {};
