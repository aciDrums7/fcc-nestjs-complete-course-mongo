import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { validate } from './common/validators/env.validator';
import { envConfig } from './config/env.config';
import { EventsModule } from './events/events.module';
import { ResourcesModule } from './resources/resources.module';
import { HttpModule } from '@nestjs/axios';
import { HttpConfig } from './config/http.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
      load: [envConfig],
      validate: validate,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('db.url')}`,
      }),
    }),
    CacheModule.register({
      // ttl: 5,
      // max: 100,
    }),
    HttpModule.registerAsync({
      useClass: HttpConfig,
    }),
    CommonModule,
    EventsModule,
    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
