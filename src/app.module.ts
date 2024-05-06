import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './common/validators/env.validation';
import { envConfig } from './config/env.config';
import { AlbumsModule } from './resources/albums/albums.module';
import { SongsModule } from './resources/songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      load: [envConfig],
      validate: validate,
    }),
    MongooseModule.forRoot(
      'mongodb://mongo:mongo@localhost:27017/spotify-clone?authSource=admin'
    ),
    SongsModule,
    AlbumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
