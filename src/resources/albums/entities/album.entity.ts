import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { Song } from 'src/resources/songs/entities/song.entity';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
@Exclude()
export class Album {
  @Prop({
    required: true,
  })
  @Expose()
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] }) //1
  @Expose()
  songs: Song[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
