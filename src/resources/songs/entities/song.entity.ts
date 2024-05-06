import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Album } from 'src/resources/albums/entities/album.entity';

//? The SongDocument is utilized upon injecting the Model into the SongService. It is a
//? NestJS-specific approach to apply TypeScript interfaces for Mongoose models, promoting
//? type safety and IntelliSense in the service layer.

//? Utilization of the SongDocument type within the song schema file ensures that the object
//? adheres to the defined schema, a practice that enforces type safety and reduces runtime
//? errors
export type SongDocument = HydratedDocument<Song>;

@Schema()
export class Song {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  releasedDate: Date;

  @Prop({
    required: true,
  })
  duration: string;

  @Prop({
    required: false,
  })
  lyrics: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
  })
  album: Album;
}

//? SchemaFactory is tasked with generating the bare schema definition. Employing
//? console.log on SongSchema will reveal the structured outcome, demonstrating the
//? schema's conversion to a format that Mongoose can use to enforce document structure in
//? MongoDB.
export const SongSchema = SchemaFactory.createForClass(Song);
