import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateSongDto } from '../dtos/create-song.dto';
import { FindSongDto } from '../dtos/find-song.dto';
import { UpdateSongDto } from '../dtos/update-song.dto';
import { Song } from '../entities/song.entity';
import { SongsService } from '../songs.service';
import { SongsModelMock, findSongDto, songId } from './mocks/songs.model.mock';
import { NotFoundException } from '@nestjs/common';

describe('SongsService', () => {
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          // Provider for the mongoose model
          provide: getModelToken(Song.name),
          useValue: SongsModelMock,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSong', () => {
    const createSongDto: CreateSongDto = {
      title: 'Pneuma',
      releasedDate: new Date('2023-05-02T00:00:00.000Z'),
      duration: '05:45',
      lyrics: 'Yellow',
      album: '',
    };

    it('should create a song and return it', async () => {
      const repoSpy = jest.spyOn(service, 'createSong');

      const result = await service.createSong(createSongDto);

      expect(repoSpy).toHaveBeenCalledWith(createSongDto);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto>(findSongDto);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.findSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('findAllSongs', () => {
    it('should return an array of songs', async () => {
      const repoSpy = jest.spyOn(service, 'findAllSongs');

      const result = await service.findAllSongs();

      expect(repoSpy).toHaveBeenCalled();
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto[]>([findSongDto]);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.findSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('findSongById', () => {
    it('should return a song by id', async () => {
      const repoSpy = jest.spyOn(service, 'findSongById');

      const result = await service.findSongById(songId);

      expect(repoSpy).toHaveBeenCalledWith(songId);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto>(findSongDto);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.findSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('updateSongById', () => {
    const updateSongDto: UpdateSongDto = {
      lyrics: 'Test lyrics',
      album: '6637bcd1aef769fc1760cd8b',
    };
    it('should update a song and return it', async () => {
      const repoSpy = jest.spyOn(service, 'updateSongById');

      const result = await service.updateSongById(songId, updateSongDto);

      expect(repoSpy).toHaveBeenCalledWith(songId, updateSongDto);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto>({
        ...findSongDto,
        ...updateSongDto,
        album: {
          id: updateSongDto.album,
          title: 'Fear Inoculum',
          songs: null,
        },
      });
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.updateSongById(wrongId, updateSongDto)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('deleteSongById', () => {
    it('should delete a song and return the deleted song', async () => {
      const expectedResult: any = {
        acknowledged: true,
        deletedCount: 1,
      };

      const repoSpy = jest.spyOn(service, 'deleteSongById');

      const result = await service.deleteSongById(songId);

      expect(repoSpy).toHaveBeenCalledWith(songId);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.deleteSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });
});
