import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, QueryWithHelpers } from 'mongoose';
import { FindSongDto } from '../songs/dto/find-song.dto';
import { Song } from '../songs/entities/song.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FindAlbumDto } from './dto/find-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album, AlbumDocument } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<FindAlbumDto> {
    const album = await this.albumModel.create(createAlbumDto);
    return plainToInstance(FindAlbumDto, album, {
      enableCircularCheck: true,
    });
  }

  //? The populate method is applied on the album model to retrieve all songs associated with each
  //? album. Utilizing this feature in NestJS effectively allows for eager loading of related entities, which
  //? streamlines data retrieval processes. It is considered a good practice to carefully manage such
  //? operations to optimize query performance and maintain data integrity
  async findAll(): Promise<FindAlbumDto[]> {
    const albums = await this.albumModel
      .find()
      .populate('songs', null, Song.name);
    return albums.map((album) => {
      const albumObj = plainToInstance(FindAlbumDto, album, {
        enableCircularCheck: true,
      });
      albumObj.songs = plainToInstance(FindSongDto, album.songs, {
        enableCircularCheck: true,
        excludePrefixes: ['album'],
      });
      return albumObj;
    });
  }

  async findOneById(id: string): Promise<FindAlbumDto> {
    const album = await this.albumModel
      .findById(id)
      .populate('songs', null, Song.name)
      .orFail();
    const albumObj = plainToInstance(FindAlbumDto, album, {
      enableCircularCheck: true,
    });
    albumObj.songs = plainToInstance(FindSongDto, album.songs, {
      enableCircularCheck: true,
      excludePrefixes: ['album'],
    });
    return albumObj;
  }

  async updateOneById(
    id: string,
    updateAlbumDto: UpdateAlbumDto
  ): Promise<FindAlbumDto> {
    const album = await this.albumModel
      .findByIdAndUpdate(id, updateAlbumDto, { new: true })
      .orFail();
    return plainToInstance(FindAlbumDto, album, {
      enableCircularCheck: true,
    });
  }

  async deleteOneById(
    id: string
  ): Promise<QueryWithHelpers<any, AlbumDocument>> {
    const deleteResult = await this.albumModel.deleteOne({ _id: id }).orFail();
    return deleteResult;
  }
}
