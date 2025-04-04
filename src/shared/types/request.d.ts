import { TokenPayload } from 'src/modules/auth/types/token.payload';

declare module 'express' {
  interface Request {
    user: TokenPayload;
    cookies: {
      Refresh: string;
    };
  }
}

export {};
