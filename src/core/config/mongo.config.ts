import { ConfigService } from '@nestjs/config';

export const getConfigMongo = (configService: ConfigService) => ({
  dbName: configService.getOrThrow<string>('DATABASE_NAME'),
  uri: configService.getOrThrow<string>('DATABASE_URI'),
  user: configService.getOrThrow<string>('DATABASE_USERNAME'),
  pass: configService.getOrThrow<string>('DATABASE_PASSWORD'),
});
