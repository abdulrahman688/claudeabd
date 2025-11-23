import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: configService.get('REDIS_URL', 'redis://localhost:6379'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
