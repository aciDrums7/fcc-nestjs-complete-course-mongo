import { Exclude, Expose, Transform } from 'class-transformer';
import { FindSongDto } from 'src/resources/songs/dtos/find-song.dto';

@Exclude()
export class FindAlbumDto {
  @Expose()
  @Transform(({ obj }) => obj._id)
  id: string;

  @Expose()
  title: string;

  @Expose()
  songs: FindSongDto[];
}
