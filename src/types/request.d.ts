import { UserData } from 'src/users/users.dto';

declare module 'express' {
  interface Request {
    user: UserData;
  }
}

export {};
