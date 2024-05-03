import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './entities/song.entity';

@Module({
  imports: [
    //? The MongooseModule employs the forFeature() method to configure itself, allowing specific
    //? models to be registered within the current scope. It is a NestJS-specific mechanism that ensures
    //? model encapsulation and modularity, a recommended approach for maintaining clean and
    //? manageable database-related code.
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
