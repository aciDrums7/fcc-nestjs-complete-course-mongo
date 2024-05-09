import { NotFoundException } from '@nestjs/common';
import { QueryWithHelpers } from 'mongoose';
import { CreateSongDto } from '../../dtos/create-song.dto';
import { FindSongDto } from '../../dtos/find-song.dto';
import { UpdateSongDto } from '../../dtos/update-song.dto';
import { SongDocument } from '../../entities/song.entity';
import { findSongDtoMock, songId } from './dtos/find-song.dto.mock';

export const SongsServiceMock = {
  createSong: jest.fn().mockImplementation((createSongDto: CreateSongDto) =>
    Promise.resolve<FindSongDto>({
      ...createSongDto,
      id: songId,
      album: null,
    })
  ),
  findAllSongs: jest.fn().mockResolvedValue([findSongDtoMock]),
  findSongById: jest.fn().mockImplementation((id: string) => {
    if (id === songId) {
      return Promise.resolve<FindSongDto>(findSongDtoMock);
    }
    return Promise.reject(
      new NotFoundException(`Song with id ${id} not found`)
    );
  }),
  updateSongById: jest
    .fn()
    .mockImplementation((id: string, updateSongDto: UpdateSongDto) => {
      if (id === songId) {
        return Promise.resolve<FindSongDto>({
          ...findSongDtoMock,
          ...updateSongDto,
          album: {
            id: '6637bcd1aef769fc1760cd8b',
            title: 'Fear Inoculum',
            songs: null,
          },
        });
      }
      return Promise.reject(
        new NotFoundException(`Song with id ${id} not found`)
      );
    }),
  deleteSongById: jest.fn().mockImplementation((id: string) => {
    if (id === songId) {
      return {
        acknowledged: true,
        deletedCount: 1,
      } as unknown as QueryWithHelpers<any, SongDocument>;
    }
    return Promise.reject(
      new NotFoundException(`Song with id ${id} not found`)
    );
  }),
};
