import { Injectable } from '@nestjs/common';
import { createRequire } from 'module';
import { AppDto } from './dto/app.dto.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

@Injectable()
export class AppService {
  index(): AppDto {
    return {
      version: packageJson.version,
    };
  }
}
