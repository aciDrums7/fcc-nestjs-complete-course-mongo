import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, QueryWithHelpers } from 'mongoose';
import { FindAlbumDto } from '../albums/dto/find-album.dto';
import { Album } from '../albums/entities/album.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { FindSongDto } from './dto/find-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song, SongDocument } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private readonly songModel: Model<SongDocument>
  ) {}

  async create(createSongDto: CreateSongDto): Promise<FindSongDto> {
    const song = await this.songModel.create(createSongDto);
    return plainToInstance(FindSongDto, song, {
      enableCircularCheck: true,
    });
  }

  async findAll(): Promise<FindSongDto[]> {
    const songs = await this.songModel
      .find()
      .populate('album', null, Album.name);
    const songsObj = plainToInstance(FindSongDto, songs, {
      enableCircularCheck: true,
    });
    songsObj.forEach((song) => {
      song.album = plainToInstance(FindAlbumDto, song.album, {
        enableCircularCheck: true,
        excludePrefixes: ['songs'],
      });
    });
    return songsObj;
  }

  async findOneById(id: string): Promise<FindSongDto> {
    const song = await this.songModel
      .findById(id)
      .populate('album', null, Album.name)
      .orFail(() => new NotFoundException(`Song with id ${id} not found`));
    const songObj = plainToInstance(FindSongDto, song, {
      enableCircularCheck: true,
    });
    songObj.album = plainToInstance(FindAlbumDto, songObj.album, {
      enableCircularCheck: true,
      excludePrefixes: ['songs'],
    });
    return songObj;
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<FindSongDto> {
    const song = await this.songModel
      .findByIdAndUpdate(id, updateSongDto, { new: true })
      .orFail(() => new NotFoundException(`Song with id ${id} not found`));
    return plainToInstance(FindSongDto, song, {
      enableCircularCheck: true,
    });
  }

  async deleteOneById(
    id: string
  ): Promise<QueryWithHelpers<any, SongDocument>> {
    const deleteResult = await this.songModel.deleteOne({ _id: id }).orFail();
    return deleteResult;
  }
}
