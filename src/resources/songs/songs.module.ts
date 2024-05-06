import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [
    //? The MongooseModule provides the forFeature() method to configure the module
    //? including defining which models should be registered in the current scope.
    //? If you also want to use the models in another module, add MongooseModule to
    //? the exports section of CatsModule and import CatsModule in the other module.
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [
    SongsService,
    /* MongooseModule */
  ],
})
export class SongsModule {}
