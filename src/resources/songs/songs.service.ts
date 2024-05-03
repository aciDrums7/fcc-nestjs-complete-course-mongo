import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, QueryWithHelpers } from 'mongoose';
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
    try {
      const song = await this.songModel.create(createSongDto);
      return plainToInstance(FindSongDto, song.toObject());
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findAll(): Promise<FindSongDto[]> {
    const songs = await this.songModel.find();
    return songs.map((song) => plainToInstance(FindSongDto, song.toObject()));
  }

  async findOneById(id: string): Promise<FindSongDto> {
    try {
      const song = await this.songModel.findById(id).orFail();
      return plainToInstance(FindSongDto, song.toObject());
    } catch (err) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<FindSongDto> {
    try {
      const song = await this.songModel
        .findByIdAndUpdate(id, updateSongDto, { new: true })
        .orFail();
      return plainToInstance(FindSongDto, song.toObject());
    } catch (error) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }
  }

  async deleteOneById(
    id: string
  ): Promise<QueryWithHelpers<any, SongDocument>> {
    try {
      const deleteResult = await this.songModel.deleteOne({ _id: id }).orFail();
      return deleteResult;
    } catch (err) {
      throw new NotFoundException(`Song with id ${id} not found`);
    }
  }
}
