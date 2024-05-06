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
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.songsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoObjectIdPipe) id: string,
    @Body() updateSongDto: UpdateSongDto
  ) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  deleteOneById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.songsService.deleteOneById(id);
  }
}
