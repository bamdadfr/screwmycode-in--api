import ytdl from 'ytdl-core';
import { BadRequestException } from '@nestjs/common';

export function validateYoutubeId(id: string): void {
  const isValid = ytdl.validateID(id);
  if (!isValid) {
    throw new BadRequestException('YouTube id is not valid');
  }
}
