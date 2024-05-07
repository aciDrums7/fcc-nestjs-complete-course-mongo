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
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';
import { MongoObjectIdPipe } from 'src/common/pipes/mongo-object-id/mongo-object-id.pipe';

@ApiTags('albums')
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.createAlbum(createAlbumDto);
  }

  @Get()
  findAllAlbums() {
    return this.albumsService.findAllAlbums();
  }

  @Get(':id')
  findAlbumById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.albumsService.findAlbumById(id);
  }

  @Patch(':id')
  updateAlbumById(
    @Param('id', MongoObjectIdPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto
  ) {
    return this.albumsService.updateAlbumById(id, updateAlbumDto);
  }

  @Delete(':id')
  deleteAlbumById(@Param('id', MongoObjectIdPipe) id: string) {
    return this.albumsService.deleteAlbumById(id);
  }
}
