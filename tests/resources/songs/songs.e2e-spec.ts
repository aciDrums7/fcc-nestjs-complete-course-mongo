import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import {
  MongooseModule,
  getConnectionToken,
  getModelToken,
} from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { validate } from 'class-validator';
import mongoose, { Model } from 'mongoose';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions/all-exceptions.filter';
import { AllExceptionsResponseDto } from 'src/common/filters/all-exceptions/dtos/all-exceptions-response.dto';
import { envConfig } from 'src/config/env.config';
import { AlbumsModule } from 'src/resources/albums/albums.module';
import { CreateAlbumDto } from 'src/resources/albums/dtos/create-album.dto';
import {
  Album,
  AlbumDocument,
} from 'src/resources/albums/entities/album.entity';
import { createAlbumDtoMock } from 'src/resources/albums/tests/mocks/dtos/create-album.dto.mock';
import { CreateSongDto } from 'src/resources/songs/dtos/create-song.dto';
import { Song, SongDocument } from 'src/resources/songs/entities/song.entity';
import { SongsModule } from 'src/resources/songs/songs.module';
import {
  createSongDtoMock,
  createSongDtoWithAlbumMock,
} from 'src/resources/songs/tests/mocks/dtos/create-song.dto.mock';
import { updateSongDtoMock } from 'src/resources/songs/tests/mocks/dtos/update-song.dto.mock';
import request from 'supertest';

describe('SongsController (e2e)', () => {
  let app: INestApplication;
  let songsModel: Model<SongDocument>;
  let albumsModel: Model<AlbumDocument>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`.env`],
          load: [envConfig],
          validate: validate,
        }),
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: `${configService.get<string>('db.url')}`,
            dbName: `${configService.get<string>('db.name')}-tests-e2e`,
          }),
        }),
        SongsModule,
        AlbumsModule,
      ],
      providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
    }).compile();

    app = moduleFixture.createNestApplication();
    songsModel = app.get(getModelToken(Song.name));
    albumsModel = app.get(getModelToken(Album.name));
    await app.init();
  });

  afterAll(async () => {
    const connection = app.get(getConnectionToken());
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  const createSong = async (createSongDto: CreateSongDto) => {
    return await songsModel.create(createSongDto);
  };

  const createAlbum = async (createAlbumDto: CreateAlbumDto) => {
    return await albumsModel.create(createAlbumDto);
  };

  describe('GET /songs', () => {
    it('should return 200 with an array of songs as body', async () => {
      const song = await createSong(createSongDtoMock);

      const album = await createAlbum(createAlbumDtoMock);
      album.id = album.id.toString();
      delete album.songs;
      createSongDtoWithAlbumMock.album = album.id;
      const songWithAlbum = await createSong(createSongDtoWithAlbumMock);

      const response = await request(app.getHttpServer()).get('/songs');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(2);

      expect(response.body[0].title).toEqual(song.title);
      expect(response.body[0].releasedDate).toEqual(
        song.releasedDate.toISOString()
      );
      expect(response.body[0].duration).toEqual(song.duration);
      expect(response.body[0].lyrics).toEqual(song.lyrics);
      expect(response.body[0].album).toEqual(song.album);

      expect(response.body[1].title).toEqual(songWithAlbum.title);
      expect(response.body[1].releasedDate).toEqual(
        songWithAlbum.releasedDate.toISOString()
      );
      expect(response.body[1].duration).toEqual(songWithAlbum.duration);
      expect(response.body[1].lyrics).toEqual(songWithAlbum.lyrics);
      expect(response.body[1].album.id).toEqual(album.id);
      expect(response.body[1].album.title).toEqual(album.title);
    });
  });

  describe('GET /songs/:id', () => {
    it('should return 200 with a song as body', async () => {
      const album = await createAlbum(createAlbumDtoMock);
      album.id = album.id.toString();
      delete album.songs;
      createSongDtoWithAlbumMock.album = album.id;
      const song = await createSong(createSongDtoWithAlbumMock);

      const response = await request(app.getHttpServer()).get(
        `/songs/${song.id}`
      );

      expect(response.statusCode).toEqual(200);

      expect(response.body.title).toEqual(song.title);
      expect(response.body.releasedDate).toEqual(
        song.releasedDate.toISOString()
      );
      expect(response.body.duration).toEqual(song.duration);
      expect(response.body.lyrics).toEqual(song.lyrics);
      expect(response.body.album.id).toEqual(album.id);
      expect(response.body.album.title).toEqual(album.title);
    });

    it('should return 404 if the song does not exist', async () => {
      const wrongId = new mongoose.Types.ObjectId();
      const path = `/songs/${wrongId}`;
      const response = await request(app.getHttpServer()).get(path);

      const expectedBody: AllExceptionsResponseDto = {
        message: `Song with id ${wrongId} not found`,
        name: 'NotFoundException',
        path: path,
        statusCode: 404,
        timestamp: new Date(response.headers.date).toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
      };

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual(expectedBody.message);
      expect(response.body.name).toEqual(expectedBody.name);
      expect(response.body.path).toEqual(expectedBody.path);
      expect(response.body.statusCode).toEqual(expectedBody.statusCode);

      const receivedTimestamp = new Date(response.body.timestamp)
        .toISOString()
        .slice(0, 16); // "YYYY-MM-DDTHH:mm"
      expect(receivedTimestamp).toEqual(expectedBody.timestamp);
    });
  });

  describe('POST /songs', () => {
    it('should return 201 with the created song as body', async () => {
      const album = await createAlbum(createAlbumDtoMock);
      createSongDtoWithAlbumMock.album = album.id.toString();

      const response = await request(app.getHttpServer())
        .post('/songs')
        .send(createSongDtoWithAlbumMock);

      expect(response.statusCode).toEqual(201);
      expect(response.body.title).toEqual(createSongDtoWithAlbumMock.title);
      expect(response.body.releasedDate).toEqual(
        createSongDtoWithAlbumMock.releasedDate.toISOString()
      );
      expect(response.body.duration).toEqual(
        createSongDtoWithAlbumMock.duration
      );
      expect(response.body.lyrics).toEqual(createSongDtoWithAlbumMock.lyrics);
      expect(response.body.album).toEqual(createSongDtoWithAlbumMock.album);
    });
  });

  describe('PUT /songs/:id', () => {
    it('should return 200 with the updated song as body', async () => {
      const album = await createAlbum(createAlbumDtoMock);
      album.id = album.id.toString();
      delete album.songs;
      const song = await createSong(createSongDtoMock);
      updateSongDtoMock.album = album.id;

      const response = await request(app.getHttpServer())
        .put(`/songs/${song.id}`)
        .send(updateSongDtoMock);

      expect(response.statusCode).toEqual(200);

      expect(response.body.title).toEqual(song.title);
      expect(response.body.releasedDate).toEqual(
        song.releasedDate.toISOString()
      );
      expect(response.body.duration).toEqual(song.duration);
      expect(response.body.lyrics).toEqual(updateSongDtoMock.lyrics);
      expect(response.body.album).toEqual(album.id);
    });

    it('should return 404 if the song does not exist', async () => {
      const wrongId = new mongoose.Types.ObjectId();
      const path = `/songs/${wrongId}`;
      const response = await request(app.getHttpServer())
        .put(path)
        .send(updateSongDtoMock);

      const expectedBody: AllExceptionsResponseDto = {
        message: `Song with id ${wrongId} not found`,
        name: 'NotFoundException',
        path: path,
        statusCode: 404,
        timestamp: new Date(response.headers.date).toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
      };

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual(expectedBody.message);
      expect(response.body.name).toEqual(expectedBody.name);
      expect(response.body.path).toEqual(expectedBody.path);
      expect(response.body.statusCode).toEqual(expectedBody.statusCode);

      const receivedTimestamp = new Date(response.body.timestamp)
        .toISOString()
        .slice(0, 16); // "YYYY-MM-DDTHH:mm"
      expect(receivedTimestamp).toEqual(expectedBody.timestamp);
    });
  });

  describe('DELETE /songs/:id', () => {
    it('should return 200 with the query result as body', async () => {
      const song = await createSong(createSongDtoMock);

      const response = await request(app.getHttpServer()).delete(
        `/songs/${song.id}`
      );

      expect(response.statusCode).toEqual(200);

      expect(response.body).toEqual({
        acknowledged: true,
        deletedCount: 1,
      });
    });

    it('should return 404 if the song does not exist', async () => {
      const wrongId = new mongoose.Types.ObjectId();
      const path = `/songs/${wrongId}`;
      const response = await request(app.getHttpServer()).delete(path);

      const expectedBody: AllExceptionsResponseDto = {
        message: `Song with id ${wrongId} not found`,
        name: 'NotFoundException',
        path: path,
        statusCode: 404,
        timestamp: new Date(response.headers.date).toISOString().slice(0, 16), // "YYYY-MM-DDTHH:mm"
      };

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual(expectedBody.message);
      expect(response.body.name).toEqual(expectedBody.name);
      expect(response.body.path).toEqual(expectedBody.path);
      expect(response.body.statusCode).toEqual(expectedBody.statusCode);

      const receivedTimestamp = new Date(response.body.timestamp)
        .toISOString()
        .slice(0, 16); // "YYYY-MM-DDTHH:mm"
      expect(receivedTimestamp).toEqual(expectedBody.timestamp);
    });
  });
});
