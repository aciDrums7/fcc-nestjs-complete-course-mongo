import { Exclude, Expose } from 'class-transformer';
import { FindAlbumDto } from 'src/resources/albums/dtos/find-album.dto';

@Exclude()
export class FindSongDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  releasedDate: Date;

  @Expose()
  duration: string;

  @Expose()
  lyrics: string;

  @Expose()
  album: FindAlbumDto;
}
