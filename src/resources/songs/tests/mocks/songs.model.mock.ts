import { NotFoundException } from '@nestjs/common';
import { QueryWithHelpers } from 'mongoose';
import { CreateSongDto } from '../../dtos/create-song.dto';
import { UpdateSongDto } from '../../dtos/update-song.dto';
import { SongDocument } from '../../entities/song.entity';
import { findSongDtoMock, songId } from './dtos/find-song.dto.mock';

export const SongsModelMock = {
  create: jest.fn((createSongDto: CreateSongDto) =>
    Promise.resolve({
      ...createSongDto,
      id: songId,
      album: null,
    } as unknown as SongDocument)
  ),
  find: jest.fn(() => ({
    populate: jest
      .fn()
      .mockResolvedValue([findSongDtoMock] as unknown as SongDocument[]),
  })),
  findById: jest.fn((id: string) => ({
    populate: jest.fn().mockReturnThis(),
    orFail: jest.fn().mockImplementation(() => {
      if (id === songId) {
        return Promise.resolve(findSongDtoMock as unknown as SongDocument);
      }
      return Promise.reject(
        new NotFoundException(`Song with id ${id} not found`)
      );
    }),
  })),
  findByIdAndUpdate: jest.fn((id: string, updateSongDto: UpdateSongDto) => ({
    populate: jest.fn().mockReturnThis(),
    orFail: jest.fn(() => {
      if (id === songId) {
        return Promise.resolve({
          ...findSongDtoMock,
          ...updateSongDto,
          album: {
            id: '6637bcd1aef769fc1760cd8b',
            title: 'Fear Inoculum',
            songs: null,
          },
        } as unknown as SongDocument);
      }
      return Promise.reject(
        new NotFoundException(`Song with id ${id} not found`)
      );
    }),
  })),
  deleteOne: jest.fn(({ _id: id }) => ({
    orFail: jest.fn(() => {
      if (id === songId) {
        return Promise.resolve({
          acknowledged: true,
          deletedCount: 1,
        } as unknown as QueryWithHelpers<any, SongDocument>);
      }
      return Promise.reject(
        new NotFoundException(`Song with id ${id} not found`)
      );
    }),
  })),
};
