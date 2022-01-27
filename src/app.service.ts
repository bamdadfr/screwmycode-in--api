import { Injectable } from '@nestjs/common';
import { ReadAppDto } from './dto/read-app.dto.js';

@Injectable()
export class AppService {
  index(): ReadAppDto {
    return {
      success: true,
    };
  }
}
