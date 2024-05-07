import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { AreUniqueMongoIds } from 'src/common/validators/mongo-ids.validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @IsMongoId({ each: true })
  @AreUniqueMongoIds()
  songs: string[];
}
