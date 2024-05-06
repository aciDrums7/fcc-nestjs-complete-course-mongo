import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { SongsService } from './songs.service';
import { MongoObjectIdPipe } from 'src/common/pipes/mongo-object-id/mongo-object-id.pipe';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  createSong(@Body() createSongDto: CreateSongDto) {
    return this.songsService.createSong(createSongDto);
  }

  @Get()
  findAllSongs() {
    return this.songsService.findAllSongs();
  }

  @Get(':id')
  findSongById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.songsService.findSongById(id);
  }

  @Patch(':id')
  updateSongById(
    @Param('id', MongoObjectIdPipe) id: string,
    @Body() updateSongDto: UpdateSongDto
  ) {
    return this.songsService.updateSongById(id, updateSongDto);
  }

  @Delete(':id')
  deleteSongById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.songsService.deleteSongById(id);
  }
}
