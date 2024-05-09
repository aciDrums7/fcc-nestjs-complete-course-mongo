import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AllExceptionsResponseDto } from 'src/common/filters/all-exceptions/dtos/all-exceptions-response.dto';
import { MongoObjectIdPipe } from 'src/common/pipes/mongo-object-id/mongo-object-id.pipe';
import { CreateSongDto } from './dtos/create-song.dto';
import { FindSongDto } from './dtos/find-song.dto';
import { UpdateSongDto } from './dtos/update-song.dto';
import { SongsService } from './songs.service';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a song' })
  @ApiCreatedResponse({
    description: 'The song has been created',
    type: FindSongDto,
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
    type: AllExceptionsResponseDto,
  })
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

  @Put(':id')
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
