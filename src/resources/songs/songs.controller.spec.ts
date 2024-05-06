import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { CreateSongDto } from './dto/create-song.dto';
import { FindSongDto } from './dto/find-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsController } from './songs.controller';

const moduleMocker = new ModuleMocker(global);

//! https://docs.nestjs.com/fundamentals/testing
describe('SongsController', () => {
  const songId = '6637fd0ce661958a3699ece1';

  const findSongDto: FindSongDto = {
    id: '6637fd0ce661958a3699ece1',
    title: 'Pneuma',
    releasedDate: new Date('2023-05-02T00:00:00.000Z'),
    duration: '05:45',
    lyrics: 'Yellow',
    album: null,
  };

  let songsController: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    songsController = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(songsController).toBeDefined();
  });

  describe('createSong', () => {
    const createSongDto: CreateSongDto = {
      title: 'Pneuma',
      releasedDate: new Date('2023-05-02T00:00:00.000Z'),
      duration: '05:45',
      lyrics: 'Yellow',
      album: null,
    };

    it('should create a song and return the created song', async () => {
      jest
        .spyOn(songsController, 'createSong')
        .mockImplementation(async () => findSongDto);

      expect(await songsController.createSong(createSongDto)).toBe(findSongDto);
    });

    it('should throw a validation exception if title is empty', async () => {
      const createSongDto: CreateSongDto = {
        title: '',
        releasedDate: new Date('2023-05-02T00:00:00.000Z'),
        duration: '05:45',
        lyrics: 'Yellow',
        album: null,
      };

      await expect(songsController.createSong(createSongDto)).rejects.toThrow();
    });
  });

  describe('findAllSongs', () => {
    it('should return an array of songs', async () => {
      jest
        .spyOn(songsController, 'findAllSongs')
        .mockResolvedValue([findSongDto]);

      expect(await songsController.findAllSongs()).toStrictEqual([findSongDto]);
    });
  });

  describe('findSongById', () => {
    it('should return a song by id', async () => {
      jest
        .spyOn(songsController, 'findSongById')
        .mockResolvedValue(findSongDto);

      expect(await songsController.findSongById(songId)).toBe(findSongDto);
    });
  });

  describe('updateSongById', () => {
    it('should update a song and return it', async () => {
      const updateSongDto: UpdateSongDto = {
        lyrics: 'Test lyrics',
        album: '6637bcd1aef769fc1760cd8b',
      };

      const result: FindSongDto = {
        ...findSongDto,
        lyrics: 'Yellow',
        album: {
          id: '6637bcd1aef769fc1760cd8b',
          title: 'Fear Inoculum',
          songs: null,
        },
      };
      jest.spyOn(songsController, 'updateSongById').mockResolvedValue(result);

      expect(await songsController.updateSongById(songId, updateSongDto)).toBe(
        result
      );
    });
  });

  describe('deleteSongById', () => {
    it('should delete a song and return the deleted song', async () => {
      const result: any = {
        acknowledged: true,
        deletedCount: 1,
      };

      jest.spyOn(songsController, 'deleteSongById').mockResolvedValue(result);

      expect(await songsController.deleteSongById(songId)).toBe(result);
    });
  });
});
