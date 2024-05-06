/* eslint-disable */
export default async () => {
  const t = {
    ['./resources/songs/dto/find-song.dto']: await import(
      './resources/songs/dto/find-song.dto'
    ),
    ['./resources/albums/dto/find-album.dto']: await import(
      './resources/albums/dto/find-album.dto'
    ),
    ['./resources/songs/entities/song.entity']: await import(
      './resources/songs/entities/song.entity'
    ),
    ['./resources/albums/entities/album.entity']: await import(
      './resources/albums/entities/album.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./resources/albums/dto/find-album.dto'),
          {
            FindAlbumDto: {
              id: { required: true, type: () => String },
              title: { required: true, type: () => String },
              songs: {
                required: true,
                type: () => [
                  t['./resources/songs/dto/find-song.dto'].FindSongDto,
                ],
              },
            },
          },
        ],
        [
          import('./resources/songs/dto/find-song.dto'),
          {
            FindSongDto: {
              id: { required: true, type: () => String },
              title: { required: true, type: () => String },
              releasedDate: { required: true, type: () => Date },
              duration: { required: true, type: () => Date },
              lyrics: { required: true, type: () => String },
              album: {
                required: true,
                type: () =>
                  t['./resources/albums/dto/find-album.dto'].FindAlbumDto,
              },
            },
          },
        ],
        [
          import('./resources/albums/entities/album.entity'),
          {
            Album: {
              title: { required: true, type: () => String },
              songs: {
                required: true,
                type: () => [t['./resources/songs/entities/song.entity'].Song],
              },
            },
          },
        ],
        [
          import('./resources/songs/entities/song.entity'),
          {
            Song: {
              title: { required: true, type: () => String },
              releasedDate: { required: true, type: () => Date },
              duration: { required: true, type: () => String },
              lyrics: { required: true, type: () => String },
              album: {
                required: true,
                type: () => t['./resources/albums/entities/album.entity'].Album,
              },
            },
          },
        ],
        [
          import('./resources/albums/dto/create-album.dto'),
          {
            CreateAlbumDto: {
              title: { required: true, type: () => String },
              songs: { required: true, type: () => [String] },
            },
          },
        ],
        [
          import('./resources/albums/dto/update-album.dto'),
          { UpdateAlbumDto: {} },
        ],
        [
          import('./resources/songs/dto/create-song.dto'),
          {
            CreateSongDto: {
              title: { required: true, type: () => String },
              releasedDate: { required: true, type: () => Date },
              duration: { required: true, type: () => Date },
              lyrics: { required: true, type: () => String },
              album: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./resources/songs/dto/update-song.dto'),
          { UpdateSongDto: {} },
        ],
      ],
      controllers: [
        [
          import('./app.controller'),
          { AppController: { getHello: { type: String } } },
        ],
        [
          import('./resources/albums/albums.controller'),
          {
            AlbumsController: {
              create: {
                type: t['./resources/albums/dto/find-album.dto'].FindAlbumDto,
              },
              findAll: {
                type: [t['./resources/albums/dto/find-album.dto'].FindAlbumDto],
              },
              findOneById: {
                type: t['./resources/albums/dto/find-album.dto'].FindAlbumDto,
              },
              update: {
                type: t['./resources/albums/dto/find-album.dto'].FindAlbumDto,
              },
              remove: {},
            },
          },
        ],
        [
          import('./resources/songs/songs.controller'),
          {
            SongsController: {
              create: {
                type: t['./resources/songs/dto/find-song.dto'].FindSongDto,
              },
              findAll: {
                type: [t['./resources/songs/dto/find-song.dto'].FindSongDto],
              },
              findOneById: {
                type: t['./resources/songs/dto/find-song.dto'].FindSongDto,
              },
              update: {
                type: t['./resources/songs/dto/find-song.dto'].FindSongDto,
              },
              deleteOneById: {},
            },
          },
        ],
      ],
    },
  };
};