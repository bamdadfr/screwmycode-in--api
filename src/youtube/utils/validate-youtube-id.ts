import ytdl from 'ytdl-core';
import { BadRequestException } from '@nestjs/common';

export function validateYoutubeId(id: string) {
  const isValid = ytdl.validateID(id);
  if (!isValid) {
    throw new BadRequestException('id is not valid');
  }
}
