import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { MongoObjectIdPipe } from './pipes/mongo-object-id/mongo-object-id.pipe';

@Module({
  providers: [LoggerMiddleware, MongoObjectIdPipe],
  exports: [LoggerMiddleware, MongoObjectIdPipe],
})
export class CommonModule {}
