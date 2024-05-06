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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { MongoObjectIdPipe } from 'src/common/pipes/mongo-object-id/mongo-object-id.pipe';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.albumsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', MongoObjectIdPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto
  ) {
    return this.albumsService.updateOneById(id, updateAlbumDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoObjectIdPipe) id: string) {
    return this.albumsService.deleteOneById(id);
  }
}
