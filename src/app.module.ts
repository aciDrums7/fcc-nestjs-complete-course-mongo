import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/validators/env.validation';
import { envConfig } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { SongsModule } from './resources/songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.dev' /* , '.env.prod' */],
      load: [envConfig],
      validate: validate,
    }),
    MongooseModule.forRoot(
      'mongodb://mongo:mongo@localhost:27017/spotify-clone?authSource=admin'
    ),
    SongsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
