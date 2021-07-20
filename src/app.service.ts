import { Injectable } from '@nestjs/common';
import { ReadAppDto } from './dto/read-app.dto';

@Injectable()
export class AppService {
  index(): ReadAppDto {
    return {
      success: true,
    };
  }
}
