import {
  IsDateString,
  IsMilitaryTime,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  releasedDate: Date;

  @IsNotEmpty()
  @IsMilitaryTime()
  duration: Date;

  @IsNotEmpty()
  @IsString()
  lyrics: string;

  @IsOptional()
  @IsMongoId()
  album: string;
}
