import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { AlbumsModule } from './albums/albums.module';

@Module({ imports: [SongsModule, AlbumsModule] })
export class ResourcesModule {}
