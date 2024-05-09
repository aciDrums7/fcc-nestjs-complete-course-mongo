import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FindSongDto } from '../dtos/find-song.dto';
import { Song } from '../entities/song.entity';
import { SongsService } from '../songs.service';
import { createSongDtoMock } from './mocks/dtos/create-song.dto.mock';
import { findSongDtoMock, songId } from './mocks/dtos/find-song.dto.mock';
import { SongsModelMock } from './mocks/songs.model.mock';
import { updateSongDtoMock } from './mocks/dtos/update-song.dto.mock';

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
    it('should create a song and return it', async () => {
      const repoSpy = jest.spyOn(service, 'createSong');

      const result = await service.createSong(createSongDtoMock);

      expect(repoSpy).toHaveBeenCalledWith(createSongDtoMock);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto>(findSongDtoMock);
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
      expect(result).toEqual<FindSongDto[]>([findSongDtoMock]);
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
      expect(result).toEqual<FindSongDto>(findSongDtoMock);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(service.findSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('updateSongById', () => {
    it('should update a song and return it', async () => {
      const repoSpy = jest.spyOn(service, 'updateSongById');

      const result = await service.updateSongById(songId, updateSongDtoMock);

      expect(repoSpy).toHaveBeenCalledWith(songId, updateSongDtoMock);
      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual<FindSongDto>({
        ...findSongDtoMock,
        ...updateSongDtoMock,
        album: {
          id: updateSongDtoMock.album,
          title: 'Fear Inoculum',
          songs: null,
        },
      });
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';

      expect(
        service.updateSongById(wrongId, updateSongDtoMock)
      ).rejects.toThrow(
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
