import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class FindSongDto {
  @Expose()
  @Transform(({ obj }) => obj._id)
  id: string;

  @Expose()
  title: string;

  @Expose()
  releasedDate: Date;

  @Expose()
  duration: Date;

  @Expose()
  lyrics: string;
}
