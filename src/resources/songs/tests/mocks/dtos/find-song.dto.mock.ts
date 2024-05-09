import { FindSongDto } from '../../../dtos/find-song.dto';

export const songId = '6637fd0ce661958a3699ece1';

export const findSongDtoMock: FindSongDto = {
  id: songId,
  title: 'Pneuma',
  releasedDate: new Date('2023-05-02T00:00:00.000Z'),
  duration: '05:45',
  lyrics: 'Yellow',
  album: null,
};
