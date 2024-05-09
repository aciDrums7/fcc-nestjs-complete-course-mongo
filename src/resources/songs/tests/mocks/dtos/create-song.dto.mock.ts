import { CreateSongDto } from '../../../dtos/create-song.dto';

export const createSongDtoMock: CreateSongDto = {
  title: 'Pneuma',
  releasedDate: new Date('2023-05-02T00:00:00.000Z'),
  duration: '05:45',
  lyrics: 'Yellow',
};

export const createSongDtoWithAlbumMock: CreateSongDto = {
  title: 'Pneuma',
  releasedDate: new Date('2023-05-02T00:00:00.000Z'),
  duration: '05:45',
  lyrics: 'Yellow',
  album: '6637bcd1aef769fc1760cd8b',
};
