import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from '../songs.controller';
import { SongsService } from '../songs.service';
import { createSongDtoMock } from './mocks/dtos/create-song.dto.mock';
import { findSongDtoMock, songId } from './mocks/dtos/find-song.dto.mock';
import { SongsServiceMock } from './mocks/songs.service.mock';
import { updateSongDtoMock } from './mocks/dtos/update-song.dto.mock';

//! https://docs.nestjs.com/fundamentals/testing
describe('SongsController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [{ provide: SongsService, useValue: SongsServiceMock }],
    }).compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSong', () => {
    it('should create a song and return the created song', async () => {
      const createSongSpy = jest.spyOn(controller, 'createSong');

      const result = await controller.createSong(createSongDtoMock);

      expect(createSongSpy).toHaveBeenCalledWith(createSongDtoMock);
      expect(createSongSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(findSongDtoMock);
    });
  });

  describe('findAllSongs', () => {
    it('should return an array of songs', async () => {
      const findAllSongsSpy = jest.spyOn(controller, 'findAllSongs');

      const result = await controller.findAllSongs();

      expect(findAllSongsSpy).toHaveBeenCalled();
      expect(findAllSongsSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual([findSongDtoMock]);
    });
  });

  describe('findSongById', () => {
    it('should return a song by id', async () => {
      const findSongByIdSpy = jest.spyOn(controller, 'findSongById');

      const result = await controller.findSongById(songId);

      expect(findSongByIdSpy).toHaveBeenCalledWith(songId);
      expect(findSongByIdSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(findSongDtoMock);
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';
      expect(controller.findSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('updateSongById', () => {
    it('should update a song and return it', async () => {
      const updateSongByIdSpy = jest.spyOn(controller, 'updateSongById');

      const result = await controller.updateSongById(songId, updateSongDtoMock);

      expect(updateSongByIdSpy).toHaveBeenCalledWith(songId, updateSongDtoMock);
      expect(updateSongByIdSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        ...findSongDtoMock,
        ...updateSongDtoMock,
        album: {
          id: '6637bcd1aef769fc1760cd8b',
          title: 'Fear Inoculum',
          songs: null,
        },
      });
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';
      expect(
        controller.updateSongById(wrongId, updateSongDtoMock)
      ).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });

  describe('deleteSongById', () => {
    it('should delete a song and return the deleted song', async () => {
      const deleteSongSpy = jest.spyOn(controller, 'deleteSongById');

      const responseBody = await controller.deleteSongById(songId);

      expect(deleteSongSpy).toHaveBeenCalledWith(songId);
      expect(deleteSongSpy).toHaveBeenCalledTimes(1);
      expect(responseBody).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });

    it('should throw a NotFoundException if the song does not exist', () => {
      const wrongId = 'wrongId';
      expect(controller.deleteSongById(wrongId)).rejects.toThrow(
        new NotFoundException(`Song with id ${wrongId} not found`)
      );
    });
  });
});
